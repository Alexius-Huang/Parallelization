import Vue from 'vue';
import Vuex from 'vuex';
import Router from './Router';
import Epics from './Epics';
import Boards from './Boards';
import Messages from './Messages';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    router: Router,
    epics: Epics,
    boards: Boards,
    messages: Messages,
  },
});
