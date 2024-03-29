/* eslint-disable no-console */
import N from 'node-notifier';
import { injectGetters, injectMutations } from './helper';
import { MessageTypes, MessageMergable } from '../resources/message-types';
import * as API from '../API';

const defaultState = {
  currentPage: 0,
  data: [],
  hasNextPage: true,
  latestMessage: null,
};

N.notify({
  title: 'Welcome to Parallelization',
  message: 'Have a nice day',
});

export default {
  namespaced: true,
  state: defaultState,
  mutations: injectMutations(defaultState, {}),
  getters: injectGetters(defaultState, {}),
  actions: {
    async setLatestMessage({ commit }) {
      const [lastMessage] = await API.lastMessage();
      commit('setLatestMessage', lastMessage);
    },
    async nextPage({ getters, commit }) {
      const { data: currentData, currentPage, hasNextPage } = getters;
      if (!hasNextPage) {
        console.warn('[Message] There are no messages left in next page...');
        return;
      }
      const limit = 10;
      const data = await API.fetchMessages({ page: currentPage + 1, limit });

      if (data.length < limit) commit('setHasNextPage', false);
      commit('setData', currentData.concat(data));
    },
    async reset({ commit }) {
      commit('setData', []);
      commit('setCurrentPage', 0);
      commit('setHasNextPage', true);
    },
    async create({ rootGetters, getters, dispatch }, payload) {
      const { type, meta } = payload;
      const { latestMessage } = getters;

      if (type === undefined) {
        console.error('[Error] Should specify property `type` create message data.');
        return;
      }

      const now = Date.now();
      const shouldMergeMessage = (
        MessageMergable[type] &&
        latestMessage &&
        latestMessage.type === type &&
        now - latestMessage.createdAt < (60 * 1000)
      );

      let message;
      const info = shouldMergeMessage ? latestMessage.info : [];

      if (type === MessageTypes.CREATE_TICKET) {
        const { title, epicId, point } = meta;
        message = 'New Ticket Created';
        info.push({
          title: 'Ticket Name',
          content: title,
          type: 'tag',
          color: ['#eeeeee', 'rgba(0, 0, 0, 0.84)'],
        });
        N.notify({
          title: message,
          message: `${title} has created.`,
        });

        if (point !== 0) {
          info.push({
            title: 'Assigned Point',
            content: point,
            type: 'tag',
            color: ['#eeeeee', 'rgba(0, 0, 0, 0.84)'],
          });
        }
        if (epicId !== -1) {
          const epicsMap = rootGetters['epics/data'];
          const epic = epicsMap.get(epicId);
          info.push({
            title: 'Assigned Epic',
            content: epic.title,
            type: 'tag',
            color: epic.color,
          });
        }
      } else if (type === MessageTypes.CREATE_EPIC) {
        const { title, color } = meta;
        message = 'New Epic Created';
        info.push({
          title: 'Epic Name',
          content: title,
          type: 'tag',
          color,
        });
      } else if (type === MessageTypes.CREATE_BOARD) {
        const { title, color } = meta;
        message = 'New Scrum Board Created';
        info.push({
          title: 'Scrum Board Name',
          content: title,
          type: 'tag',
          color,
        });
      } else if (type === MessageTypes.ASSIGN_TICKET_TO_BOARD) {
        const { ticketName, boardName } = meta;
        message = 'Ticket Assigned To Scrum Board';
        const content = `<strong>${ticketName}</strong> has assigned to <strong>${boardName}</strong>`;
        info.push({ content, type: 'info' });
      } else if (type === MessageTypes.DROP_TICKET_FROM_BOARD) {
        const { ticketName } = meta;
        message = 'Ticket Dropped from Scrum Board';
        const content = `<strong>${ticketName}</strong> has dropped from scrum board`;
        info.push({ content, type: 'info' });
      } else {
        console.error('[Error] Unknown message type.');
      }

      const input = {
        type,
        message,
        info,
        createdAt: Date.now(),
      };

      if (shouldMergeMessage) {
        await API.updateMessage(latestMessage.id, input);
      } else {
        await API.createMessage(input);
      }
      dispatch('setLatestMessage');
    },
  },
};
