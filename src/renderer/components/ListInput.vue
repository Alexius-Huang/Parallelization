<template>
  <div class="list-input">
    <input
      type="text"
      v-model="input"
      @focus="focused = true"
      @keydown.enter="handleAddItem"
      :placeholder="$props.placeholder"
    />
    <ul class="input-list">
      <li v-for="(item, i) in list" :key="`${item}-${i}`">
        <span class="text-wrapper">{{ item }}</span>
        <button @click="handleRemoveItem(i)"><img :src="icons.remove" alt="remove" /></button>
      </li>
    </ul>
  </div>
</template>

<script>
import remove from '@/assets/remove-circle.svg';

export default {
  props: ['defaultInputs', 'placeholder'],
  data() {
    return {
      icons: { remove },
      input: '',
      list: this.$props.defaultInputs || [],
    };
  },
  methods: {
    handleAddItem() {
      this.list = [...this.list, this.input];
      this.input = '';
    },
    handleRemoveItem(index) {
      const newList = [...this.list];
      newList.splice(index, 1);
      this.list = newList;
    },
  },
};
</script>

<style scoped lang="sass">
@import '../sass/_shared.sass'

div.list-input
  > input
    padding: 0 10pt
    background-color: #222
    color: #eee
    width: 100%
    margin-top: 3px
    box-sizing: border-box
    height: 30pt
    line-height: 30pt
    font-size: 12pt
    border: none
  > ul.input-list
    width: 100%
    box-sizing: border-box
    padding: 0 5pt
    margin-top: 5pt
    > li
      display: inline-block
      height: 25pt
      @include vertical-align
      margin-right: 10pt

      > span.text-wrapper
        font-size: 10pt
      > button
        margin-left: 3pt
        width: 16pt
        height: 16pt
        opacity: 0.5
        &:hover
          opacity: 0.8
        > img
          width: 100%
          height: 100%

</style>
