<template>
  <div class="select-input">
    <input
      type="text"
      v-model="input"
      @focus="focused = true"
    />
    <ul class="option-list" :class="{ active: focused }">
      <li v-for="{ title, value } in options" :key="value">
        <button @click="handleChangeOption(title, value)">
          {{ title }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['options', 'default', 'default-value'],
  data() {
    return { focused: false, input: this.$props.default };
  },
  methods: {
    blurWhenClickOutside(event) {
      if (!event.target.closest('.select-input')) {
        this.focused = false;
      }
    },
    handleChangeOption(title, value) {
      this.input = title;
      this.$emit('input', value);
      this.focused = false;
    },
  },
  mounted() {
    document.addEventListener('click', this.blurWhenClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.blurWhenClickOutside);
  },
};
</script>

<style scoped lang="sass">
div.select-input
  position: relative
  > input
    padding: 0 10pt
    background-color: #222
    color: #eee
    width: 100%
    margin-top: 3pt
    box-sizing: border-box
    height: 30pt
    line-height: 30pt
    font-size: 12pt
    border: none
  > ul.option-list
    position: absolute
    top: 33pt
    right: 0
    background-color: #333
    box-shadow: 2.5pt 2.5pt 5pt #222
    max-height: 100pt
    overflow-y: auto
    display: none
    &.active
      display: block
    > li
      > button
        text-align: right
        display: inline-block
        padding: 0 10pt
        font-size: 10pt
        height: 22pt
        line-height: 22pt
        width: 100%
        color: rgba(255, 255, 255, 0.54)
        font-weight: 300
        &:hover
          color: rgba(255, 255, 255, 0.87)
          background-color: rgba(255, 255, 255, 0.1)
</style>
