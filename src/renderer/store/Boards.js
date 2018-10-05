/* eslint-disable no-console */
import * as API from '@/API';
import { MessageTypes } from '@/resources/message-types';
import { injectGetters, injectMutations } from './helper';

const defaultState = { data: new Map(), focused: -1 };

export default {
  namespaced: true,
  state: defaultState,
  mutations: injectMutations(defaultState, {}),
  getters: injectGetters(defaultState, {}),
  actions: {
    async fetch({ commit }) {
      const data = await API.fetchBoards();
      const result = data.reduce((acc, cur) => acc.set(cur.id, cur), new Map());
      commit('setData', result);

      if (data.length > 0) {
        commit('setFocused', data[0].id);
      }
    },
    async create({ commit, getters, dispatch }, payload = {}) {
      const {
        title,
        description,
        columns,
        color,
      } = payload;

      if (
        title === undefined ||
        description === undefined
      ) {
        console.error('[Error] Should specify property `title`, `description` to create ticket data.');
        return;
      }

      if (columns.length === 0) {
        console.error('[Error] Should at least have one item in `columns` array to create ticket data.');
        return;
      }

      const data = await API.createBoard({
        title,
        description,
        color,
        columns,
      });

      const createMessagePayload = {
        type: MessageTypes.CREATE_BOARD,
        meta: { title, color },
      };
      await dispatch('messages/create', createMessagePayload, { root: true });

      const newData = new Map(getters.data).set(data.id, data);
      commit('setData', newData);
    },
  },
};
