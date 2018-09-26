/* eslint-disable import/no-dynamic-require, no-console */
// import fs from 'fs';
// import util from 'util';
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
    async fetch({ commit }, payload) {
      const { id } = payload;

      if (id) {
        const data = await API.fetchTickets(id);
        const result = data.reduce((acc, cur) => acc.set(cur.id, cur), new Map());
        commit('setData', result);
      } else {
        console.error('[Fetch Tickets Failure] Should specify (epic) id');
      }
    },
  },
};
