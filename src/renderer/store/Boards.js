/* eslint-disable no-console */
import { injectGetters, injectMutations } from './helper';
import * as API from '../API';

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
  },
};
