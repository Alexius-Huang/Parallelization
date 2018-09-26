<template>
  <nav>
    <div class="logo-wrapper">
      <img :src="icons.logo" alt="Parallelization Logo" />
      <h1>arallelization</h1>
    </div>

    <div class="right-section">
      <ul>
        <li>
          <button
            :class="{ active: it.isIndexPage }"
            @click="$router.push({ name: 'Index' })"
          >
            <img :src="icons.home" alt="Home" />
          </button>
        </li>
        <li>
          <button
            :class="{ active: it.isEpicsPage }"
            @click="$router.push({ name: 'Epics' })"
          >
            <img :src="icons.list" alt="Epics" />
          </button>
        </li>
        <li>
          <button
            :class="{ active: it.isScrumBoardsPage }"
            @click="$router.push({ name: 'ScrumBoards' })"
          >
            <img :src="icons.flag" alt="Scrumb Board" />
          </button>
        </li>
        <li>
          <button>
            <img :src="icons.calendar" alt="Calendar" />
          </button>
        </li>
        <li>
          <button>
            <img :src="icons.schedule" alt="Gantt Chart" />
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import logo from './assets/logo.svg';
import home from './assets/home.svg';
import calendar from './assets/calendar.svg';
import flag from './assets/flag.svg';
import list from './assets/list.svg';
import schedule from './assets/schedule.svg';

export default {
  data() {
    return {
      icons: {
        logo,
        home,
        calendar,
        flag,
        list,
        schedule,
      },
    };
  },
  computed: {
    it() { return this.$store.getters['router/pageChecker']; },
  },
};
</script>

<style scoped lang="sass">
@import './sass/_shared.sass'

nav
  position: fixed
  left: 0
  top: 0
  z-index: 100
  height: 50pt
  background-color: rgba(0, 0, 0, 0.3)
  font-size: 0
  > div.logo-wrapper
    display: inline-block
    padding-left: 24pt
    height: 100%
    width: 200pt
    box-sizing: border-box
    @include vertical-align
    > img
      height: 40pt
      width: 40pt
    > h1
      font-family: 'Roboto Mono', sans-serif
      font-weight: 100
      padding-left: 0
      margin-left: 0
      font-size: 14pt
      transform: translate(-5pt, 6.5pt)

  > div.right-section
    text-align: right
    display: inline-block
    width: calc(100vw - 200pt)
    vertical-align: top
    > ul
      display: inline-block
      height: 50pt
      > li
        display: inline-block
        height: 50pt
        width: 50pt
        > button
          @include vertical-align
          width: 100%
          height: 100%
          &:hover
            box-shadow: inset 0 -15pt 15pt -10pt #fff;
            > img
              opacity: 1
              transition: .25s
          &.active
            box-shadow: inset 0 -15pt 15pt -10pt #888;
          > img
            opacity: 0.6
            width: 18pt
            height: 18pt
            transition: .25s
</style>
