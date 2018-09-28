/* eslint-disable no-console */
import { injectGetters, injectMutations } from './helper';
import { MessageTypes } from '../resources/message-types';
import * as API from '../API';

const defaultState = {
  currentPage: 0,
  data: [],
  hasNextPage: true,
};

export default {
  namespaced: true,
  state: defaultState,
  mutations: injectMutations(defaultState, {}),
  getters: injectGetters(defaultState, {}),
  actions: {
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
    async create(_, payload) {
      const { type, meta } = payload;

      if (type === undefined) {
        console.error('[Error] Should specify property `type` create message data.');
        return;
      }

      let message;
      if (type === MessageTypes.CREATE_TICKET) {
        const { title } = meta;
        message = `You've created a ticket: ${title}`;
      } else if (type === MessageTypes.CREATE_EPIC) {
        const { title } = meta;
        message = `You've created an epic: ${title}`;
      } else {
        console.error('[Error] Unknown message type.');
      }

      const input = {
        type,
        message,
        createdAt: Date.now(),
      };

      await API.createMessage(input);
    },
  },
};
