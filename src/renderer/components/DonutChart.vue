<template>
  <div class="chart-wrapper">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 40 40"
    >
      <circle
        class="donut-hole"
        cx="20" cy="20" :r="radius"
        fill="transparent"
      />

      <circle
        class="donut-ring"
        cx="20" cy="20" :r="radius"
        fill="transparent"
        stroke="rgba(0, 0, 0, 0.2)"
        stroke-width="3"
      />

      <circle
        v-for="({ segment, offset, color }, i) in cumulativeData"
        :key="i"
        class="donut-segment"
        cx="20" cy="20" :r="radius"
        fill="transparent"
        :stroke="color"
        stroke-width="3"
        :stroke-dasharray="segment" :stroke-dashoffset="offset"
        @mouseover.stop="handleCircleMouseover(color)"
      />
    </svg>
    <ul class="legends">
      <li
        v-for="{ title, color } in $props.data"
        :key="title"
        :style="{ 'border-color': color }"
      >
        {{ title }}
      </li>
    </ul>
  </div>
</template>

<script>
import T from '@tweenjs/tween.js';

function animate(time) {
  requestAnimationFrame(animate);
  T.update(time);
}
requestAnimationFrame(animate);

export default {
  props: ['delay', 'duration', 'data'],
  data() {
    return {
      radius: (100 / (2 * Math.PI)),
      tweened: { value: 0 },
    };
  },
  computed: {
    cumulativeData() {
      const { tweened } = this;
      const { data } = this.$props;
      let cumulation = 0;
      return data.map(({ percentage, color }) => {
        const tweenedPercentage = percentage * (tweened.value / 100);
        const result = {
          color,
          segment: `${tweenedPercentage} ${100 - tweenedPercentage}`,
          offset: cumulation + 25,
        };

        cumulation -= tweenedPercentage;
        return result;
      });
    },
  },
  methods: {
    handleCircleMouseover(color) {
      console.log(color);
    },
  },
  mounted() {
    console.log(this.$props.data);
    const tweened = { value: 0 };
    const tweenEnd = { value: 100 };
    setTimeout(() => {
      new T.Tween(tweened)
        .to(tweenEnd, this.$props.duration || 1500)
        .easing(T.Easing.Cubic.InOut)
        .onUpdate(() => {
          this.tweened = { ...tweened };
        })
        .start();
    }, this.$props.delay || 1000);
  },
};
</script>

<style scoped lang="sass">
div.chart-wrapper
  > svg
    display: block
    width: 75%
    margin: 0 auto
    circle
      pointer-events: visibleStroke
      cursor: pointer
  > ul.legends
    > li
      display: inline-block
      margin-right: 10pt
      padding-left: 5pt
      margin-top: 5pt
      font-size: 12pt
      border-left: 12pt solid
</style>
