<template>
  <section>
    <h2><img :src="icons.barChart" alt="Statistics"> Statistics</h2>
    <ul class="large-number-display">
      <li>
        <h3>Active Tickets</h3>
        <p class="number">
          {{ total.tickets }}
          <img :src="icons.list" alt="Total Tickets" />
        </p>
      </li>
      <li>
        <h3>Active Epics</h3>
        <p class="number">
          {{ total.epics }}
          <img :src="icons.flag" alt="Total Epics" />
        </p>
      </li>
      <li>
        <h3>Active Boards</h3>
        <p class="number">
          {{ total.boards }}
          <img :src="icons.viewColumns" alt="Total Boards" />
        </p>
      </li>
    </ul>

    <div class="donut-charts">
      <donut-chart
        class="donut-chart"
        :data="ticketsVersusEpics"
      />
    </div>
  </section>
</template>

<script>
import DonutChart from '@/components/DonutChart';
import barChart from '@/assets/bar-chart.svg';
import listIcon from '@/assets/list.svg';
import flag from '@/assets/flag.svg';
import viewColumns from '@/assets/view-columns.svg';

export default {
  components: { DonutChart },
  data() {
    return {
      icons: {
        barChart,
        list: listIcon,
        flag,
        viewColumns,
      },
    };
  },
  computed: {
    statistics() { return this.$store.getters['statistics/data']; },
    total() { return this.statistics.total; },
    ticketsMap() { return this.$store.getters['epics/tickets/data']; },
    epicsMap() { return this.$store.getters['epics/data']; },
    ticketsVersusEpics() {
      const { ticketsMap, epicsMap, total } = this;
      const tickets = Array.from(ticketsMap.values());
      const epicTicketCount = tickets.reduce((acc, { epicId }) => {
        if (acc.has(epicId)) {
          acc.set(epicId, acc.get(epicId) + 1);
        } else {
          acc.set(epicId, 1);
        }
        return acc;
      }, new Map());

      return Array.from(epicTicketCount.keys()).map((epicId) => {
        const epic = epicsMap.get(epicId);
        const ticketsCount = epicTicketCount.get(epicId);
        return {
          percentage: (ticketsCount / total.tickets) * 100,
          color: epic ? epic.color[0] : '#666',
          title: epic ? epic.title : 'Unassigned',
        };
      });
    },
  },
};
</script>

<style scoped lang="sass">
@import '../../sass/_shared.sass'

section
  margin-top: -50pt
  height: 100vh
  width: calc(60% - 10pt)
  padding: 50pt 15pt 0 15pt
  box-sizing: border-box
  background-color: #444
  display: inline-block
  vertical-align: top
  > h2
    @include vertical-align
    font-size: 16pt
    line-height: 60pt
    padding-left: 15pt
    font-family: 'Roboto Mono', sans-serif
    font-weight: 100
    > img
      opacity: 0.5

  > ul.large-number-display
    text-align: center
    > li
      display: inline-block
      width: calc(25% - 5pt)
      margin-left: 6.67pt
      &:nth-child(3n + 1)
        margin-left: 0
      > h3
        height: 20pt
        line-height: 20pt
        padding-right: 5pt
        background-color: #222
        font-family: 'Roboto Mono', monospace
        text-align: right
        font-size: 9pt
      > p.number
        padding-right: 5pt
        font-size: 25pt
        font-weight: 500
        text-align: right
        height: 35pt
        line-height: 35pt
        background-color: #333
        position: relative
        overflow: hidden

        > img
          position: absolute
          width: 50pt
          height: 50pt
          opacity: 0.05
          left: 5pt
          bottom: -10pt

  > div.donut-charts
    margin-top: 12pt
    > .donut-chart
      max-width: 300pt
      margin: 0 auto
</style>
