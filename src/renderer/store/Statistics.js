import { injectGetters, injectMutations } from './helper';
import * as API from '../API';

const defaultState = {
  data: {
    total: {
      tickets: 0,
      epics: 0,
      boards: 0,
    },
  },
};

export default {
  namespaced: true,
  state: defaultState,
  getters: injectGetters(defaultState, {}),
  mutations: injectMutations(defaultState, {}),
  actions: {
    async fetch({ commit }) {
      const data = await API.fetchStatistics();
      commit('setData', data);
    },
    async update({ commit, getters }, payload) {
      const { mutation } = payload;
      const { data } = getters;

      const newData = mutation(data);
      const result = await API.updateStatistics(newData);
      commit('setData', result);
    },
    async totalTicketsIncrement({ dispatch }) {
      const payload = {
        mutation: statistic => ({
          ...statistic,
          total: {
            ...statistic.total,
            tickets: statistic.total.tickets + 1,
          },
        }),
      };
      await dispatch('update', payload);
    },
  },
};
