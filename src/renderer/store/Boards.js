/* eslint-disable no-console */
import { injectGetters, injectMutations } from './helper';
import * as API from '../API';

const defaultState = { data: new Map() };

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
    },
  },
};
