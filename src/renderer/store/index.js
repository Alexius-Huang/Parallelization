import Vue from 'vue';
import Vuex from 'vuex';
import Router from './Router';
import Epics from './Epics';
import Boards from './Boards';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    router: Router,
    epics: Epics,
    boards: Boards,
  },
});
