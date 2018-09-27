/* eslint-disable import/no-dynamic-require, no-console */
// import fs from 'fs';
// import util from 'util';
// import { Map } from 'immutable';
import { injectGetters, injectMutations } from '../helper';
import * as API from '../../API';
// const readFile = util.promisify(fs.readFile);

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
  },
};
