/* eslint-disable import/no-dynamic-require, no-console */
import { injectGetters, injectMutations } from '../helper';
import * as API from '../../API';
import { MessageTypes } from '../../resources/message-types';

const defaultState = { data: new Map() };

export default {
  namespaced: true,
  state: defaultState,
  mutations: injectMutations(defaultState),
  getters: injectGetters(defaultState),
  actions: {
    async fetchAll({ commit }) {
      const data = await API.fetchTickets();
      const result = data.reduce((acc, cur) => acc.set(cur.id, cur), new Map());
      commit('setData', result);
    },
    // async fetch({ commit }, payload) {
    //   const { id } = payload;

    //   if (id) {
    //     const data = await API.fetchTickets(id);
    //     const result = data.reduce((acc, cur) => acc.set(cur.id, cur), Map({}));
    //     commit('setData', result);
    //   } else {
    //     console.error('[Fetch Tickets Failure] Should specify (epic) id');
    //   }
    // },
    async create({ commit, getters, dispatch }, payload = {}) {
      const {
        title,
        description,
        point = 0,
        epicId = -1,
      } = payload;

      if (
        title === undefined ||
        description === undefined
      ) {
        console.error('[Error] Should specify property `title`, `description` to create ticket data.');
        return;
      }

      const data = await API.createTicket({
        title,
        description,
        point: Math.round(Number.parseFloat(point, 10) * 10) / 10 || 0,
        epicId: epicId || -1,
        boardId: -1,
        boardState: -1,
      });

      const createMessagePayload = {
        type: MessageTypes.CREATE_TICKET,
        meta: { title, epicId, point },
      };
      await dispatch('messages/create', createMessagePayload, { root: true });

      const newData = new Map(getters.data).set(data.id, data);
      commit('setData', newData);
    },
    async update({ commit, getters }, payload) {
      const { id, mutation } = payload;
      const ticketsMap = getters.data;
      const ticket = ticketsMap.get(id);

      if (ticket) {
        const {
          epicId,
          boardId,
          boardState,
          title,
          point,
          description,
        } = mutation(ticket);
        const parameterSanitized = {
          epicId,
          boardId,
          boardState,
          title,
          point,
          description,
        };
        const newTicket = await API.updateTicket(id, parameterSanitized);
        const newTicketsMap = new Map(ticketsMap);
        newTicketsMap.set(id, newTicket);
        commit('setData', newTicketsMap);
      } else {
        console.error(`[Ticket Next State Error] Can't find ticket with ID ${id}`);
      }
    },
    async nextState({ dispatch }, payload) {
      const { id } = payload;
      await dispatch('update', {
        id,
        mutation: ticket => ({ ...ticket, boardState: ticket.boardState + 1 }),
      });
    },
    async previousState({ dispatch }, payload) {
      const { id } = payload;
      await dispatch('update', {
        id,
        mutation: ticket => ({ ...ticket, boardState: ticket.boardState - 1 }),
      });
    },
    async assignToBoard({ dispatch, rootGetters, getters }, payload) {
      const { id, boardId } = payload;
      await dispatch('update', {
        id,
        mutation: ticket => ({ ...ticket, boardState: 0, boardId }),
      });

      const tickets = getters.data;
      const ticket = tickets.get(id);

      if (boardId === -1) {
        const createMessagePayload = {
          type: MessageTypes.DROP_TICKET_FROM_BOARD,
          meta: { ticketName: ticket.title },
        };
        await dispatch('messages/create', createMessagePayload, { root: true });
      } else {
        const boards = rootGetters['boards/data'];
        const board = boards.get(boardId);
        const createMessagePayload = {
          type: MessageTypes.ASSIGN_TICKET_TO_BOARD,
          meta: { ticketName: ticket.title, boardName: board.title },
        };
        await dispatch('messages/create', createMessagePayload, { root: true });
      }
    },
  },
};
