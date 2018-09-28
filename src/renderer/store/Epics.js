/* eslint-disable no-console */
import { injectGetters, injectMutations } from './helper';
import Tickets from './Epics/Tickets';
import { MessageTypes } from '../resources/message-types';
import * as API from '../API';

const defaultState = { data: new Map(), focused: -1 };

// [BG, Font]
const colors = [
  ['#E53935', 'rgba(0, 0, 0, 0.84)'],
  ['#D81B60', 'rgba(0, 0, 0, 0.84)'],
  ['#8E24AA', 'rgba(0, 0, 0, 0.84)'],
  ['#5E35B1', 'rgba(255, 255, 255, 0.84)'],
  ['#3949AB', 'rgba(255, 255, 255, 0.84)'],
  ['#1E88E5', 'rgba(255, 255, 255, 0.84)'],
  ['#0097A7', 'rgba(255, 255, 255, 0.84)'],
  ['#00897B', 'rgba(255, 255, 255, 0.84)'],
  ['#43A047', 'rgba(255, 255, 255, 0.84)'],
  ['#558B2F', 'rgba(255, 255, 255, 0.84)'],
  ['#CDDC39', 'rgba(0, 0, 0, 0.84)'],
  ['#FDD835', 'rgba(0, 0, 0, 0.84)'],
  ['#FFB300', 'rgba(0, 0, 0, 0.84)'],
  ['#FB8C00', 'rgba(0, 0, 0, 0.84)'],
  ['#5D4037', 'rgba(255, 255, 255, 0.84)'],
  ['#455A64', 'rgba(255, 255, 255, 0.84)'],
];

const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

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
      const { title, description } = payload;

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
        color: randomColor(),
      });

      const createMessagePayload = {
        type: MessageTypes.CREATE_EPIC,
        meta: { title },
      };
      await dispatch('messages/create', createMessagePayload, { root: true });

      const newData = new Map(getters.data).set(data.id, data);
      commit('setData', newData);
    },
  },
};
