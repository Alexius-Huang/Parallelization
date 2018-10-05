<template>
  <section>
    <h2><img :src="icons.barChart" alt="Statistics"> Statistics</h2>
  </section>
</template>

<script>
import barChart from '@/assets/bar-chart.svg';

export default {
  data() {
    return {
      icons: { barChart },
    };
  },
};
</script>

<style scoped lang="sass">
@import '../../sass/_shared.sass'

section
  margin-top: -50pt
  height: 100vh
  width: calc(50% - 10pt)
  margin-left: 20pt
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
</style>
