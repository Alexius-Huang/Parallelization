import { injectGetters, injectMutations } from './helper';

const defaultState = { router: {}, route: {} };

export default {
  namespaced: true,
  state: defaultState,
  mutations: injectMutations(defaultState),
  getters: injectGetters(defaultState, {
    pageChecker(state) {
      const { route: { name } } = state;

      return {
        isIndexPage: name === 'Index',
        isEpicsPage: name === 'Epics',
        isScrumBoardsPage: name === 'ScrumBoards',
      };
    },
  }),
};
