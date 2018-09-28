<template>
  <span class="tag">
    {{ $props.title }}
    <span
      class="inner-tag"
      v-if="$props.subTitle"
    >
      {{ $props.subTitle }}
    </span>
  </span>
</template>

<script>
export default {
  props: ['title', 'sub-title'],
};
</script>

<style scoped lang="sass">
span.tag
  display: inline-block
  font-family: 'Maven Pro', sans-serif
  font-size: 8pt
  border-radius: 4pt
  height: 16pt
  line-height: 16pt
  padding: 0 5pt
  > span.inner-tag
    display: inline-block
    height: 16pt
    padding: 0 5pt
    margin-left: 5pt
    line-height: 16pt
    margin-right: -5pt
    border-top-right-radius: 5pt
    border-bottom-right-radius: 5pt
    background-color: rgba(0, 0, 0, 0.2)
</style>

