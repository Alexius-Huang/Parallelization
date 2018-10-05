/* eslint-disable no-console */
import { injectGetters, injectMutations } from './helper';
import Tickets from './Epics/Tickets';
import { MessageTypes } from '../resources/message-types';
import * as API from '../API';

const defaultState = { data: new Map(), focused: -1 };

export default {
  namespaced: true,
  modules: { tickets: Tickets },
  state: defaultState,
  mutations: injectMutations(defaultState),
  getters: injectGetters(defaultState),
  actions: {
    async fetch({ commit }) {
      const data = await API.fetchEpics();
      const result = data.reduce((acc, cur) => acc.set(cur.id, cur), new Map());
      commit('setData', result);
    },
    async create({ getters, commit, dispatch }, payload = {}) {
      const { title, description, color } = payload;

      if (
        title === undefined ||
        description === undefined
      ) {
        console.error('[Error] Should specify property `title`, `description` to create epic data.');
        return;
      }

      const data = await API.createEpic({
        title,
        description,
        color,
      });

      const createMessagePayload = {
        type: MessageTypes.CREATE_EPIC,
        meta: { title, color },
      };
      await dispatch('messages/create', createMessagePayload, { root: true });

      const newData = new Map(getters.data).set(data.id, data);
      commit('setData', newData);
    },
  },
};
