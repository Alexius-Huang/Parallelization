<template>
  <div
    class="color-input"
    tabindex="0"
    @blur="focused = false"
  >
    <div class="input-wrapper">
      <div
        class="selected-color"
        :style="{ 'background-color': selected[0], color: selected[1] }"
        @click="focused = !focused"
      >{{ selected[0] }}</div>

      <div class="color-palette" :class="{ focused }">
        <div
          class="color-row"
          v-for="(colorLevels, i) in colors"
          :key="i"
        >
          <div
            class="color-col"
            v-for="(colorLevel, j) in colorLevels"
            :key="`${i}-${j}`"
            :style="{ 'background-color': colorLevel[0] }"
            @click="handleChangeSelected(colorLevel)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { COLOR_CODES, randomColor } from '@/resources/colors';

export default {
  data() {
    const colorTypes = Object.keys(COLOR_CODES);
    const colorLevel = Object.keys(COLOR_CODES[colorTypes[0]]);
    const colors = colorTypes.map(type => colorLevel.map(level => COLOR_CODES[type][level]));

    return {
      colors,
      selected: randomColor(),
      focused: false,
    };
  },
  methods: {
    handleChangeSelected(color) {
      this.selected = color;
      this.focused = false;
    },
  },
};
</script>

<style scoped lang="sass">
@import '../sass/_shared.sass'

div.color-input
  display: inline-block
  &:focus
    outline: none
  > div.input-wrapper
    user-select: none
    height: 30pt
    @include vertical-align
    position: relative
    > div.selected-color
      display: inline-block
      height: 25pt
      font-size: 12pt
      line-height: 21pt
      border-radius: 3pt
      padding: 0 10pt
      border: 2pt solid transparent
      box-sizing: border-box
      transition: .25s
      &:hover
        border-color: rgba(255, 255, 255, 0.3)
        transition: .25s

    > div.color-palette
      position: absolute
      padding: 10pt
      bottom: 0
      left: 100%
      display: none
      background-color: #222
      width: 190pt
      border-radius: 5pt
      &.focused
        display: block
      > div.color-row
        width: 10pt
        display: inline-block
        > div.color-col
          display: inline-block
          width: 10pt
          height: 10pt
          opacity: 0.8
          &:hover
            opacity: 1
</style>
