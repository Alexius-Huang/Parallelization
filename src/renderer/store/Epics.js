/* eslint-disable no-console */
import { injectGetters, injectMutations } from './helper';
import Tickets from './Epics/Tickets';
import * as API from '../API';

const defaultState = { data: new Map(), focused: NaN };
const colors = [
  '#E53935',
  '#D81B60',
  '#8E24AA',
  '#5E35B1',
  '#3949AB',
  '#1E88E5',
  '#0097A7',
  '#00897B',
  '#43A047',
  '#558B2F',
  '#CDDC39',
  '#FDD835',
  '#FFB300',
  '#FB8C00',
  '#5D4037',
  '#455A64',
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
    async create({ getters, commit }, payload = {}) {
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
      const newData = new Map(Array.from(getters.data)).set(data.id, data);
      commit('setData', newData);
    },
  },
};
