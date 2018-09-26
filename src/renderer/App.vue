<template>
  <div id="app">
    <navigation />
    <router-view />
  </div>
</template>

<script>
import Navigation from './Navigation';

export default {
  name: 'parallelization',
  components: { Navigation },
  computed: {
    it() { return this.$store.getters['router/pageChecker']; },
  },
  methods: {
    async startApp() {
      // const { dispatch } = this.$store;
    },
    async mapRouteToDispatch(to = {}) { // , from = {}) {
      const { it } = this;
      const { dispatch, commit, getters } = this.$store;
      // const { query, params } = getters['router/route'];

      if (it.isIndexPage) {
        /* Empty */
      } else if (it.isEpicsPage) {
        await dispatch('epics/fetch');
        const epics = getters['epics/data'];
        const focusedId = Array.from(epics.values())[0].id;

        if (focusedId) {
          commit('epics/setFocused', focusedId);
          await dispatch('epics/tickets/fetch', { id: focusedId });
        }
      } else if (it.isScrumBoardsPage) {
        await Promise.all([
          dispatch('epics/fetch'),
          dispatch('boards/fetch'),
        ]);
      } else {
        /* eslint-disable no-console */
        console.warn(`[Page Not Specified] ${to.name} isn't specified`);
      }
    },
    async updateRoute() {
      this.$store.commit('router/setRoute', this.$route);
    },
  },
  async mounted() {
    const { commit } = this.$store;
    await this.startApp();

    commit('router/setRouter', this.$router);
    commit('router/setRoute', this.$route);
    this.mapRouteToDispatch();
    this.$router.afterEach(this.updateRoute);
    this.$router.afterEach(this.mapRouteToDispatch);
  },
};
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto+Mono:100,300')
@import url('https://fonts.googleapis.com/css?family=Ubuntu:300,400');

html, body
  background-color: #333
  padding: 0
  margin: 0
  font-weight: 100
  font-family: 'Ubuntu', sans-serif
  color: rgba(255, 255, 255, 0.63)

h1, h2, h3, h4, h5, h6, p
  margin: 0
  cursor: default
  user-select: none

main
  padding-top: 50pt

ul
  padding: 0
  margin: 0
  user-select: none
li
  list-style-type: none
  user-select: none

button
  user-select: none
  background-color: transparent
  border: none
  border-radius: 0
  cursor: pointer
  transition: .25s
  &:hover
    transition: .25s
  &:focus
    outline: none
</style>
