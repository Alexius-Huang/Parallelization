import Vue from 'vue';
import Router from 'vue-router';
import Index from '../pages/Index.vue';
import Epics from '../pages/Epics.vue';
import ScrumBoards from '../pages/ScrumBoards.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    {
      path: '/epics',
      name: 'Epics',
      component: Epics,
    },
    // {
    //   path: '/task-tickets',
    //   name: 'TaskTickets',
    // },
    {
      path: '/scrum-boards',
      name: 'ScrumBoards',
      component: ScrumBoards,
    },
    // {
    //   path: '/calendar',
    //   name: 'Calendar',
    // },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
