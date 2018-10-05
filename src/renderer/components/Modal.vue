<template>
  <div class="modal-bg">
    <div class="modal-content" :style="{ width }">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: { width: String },
};
</script>

<style lang="sass">
div.modal-bg
  position: fixed
  background-color: rgba(0, 0, 0, 0.6)
  width: 100vw
  height: 100vh
  left: 0
  top: 0
  opacity: 1
  z-index: 100
  transition: .25s
  &.closed
    opacity: 0
    pointer-events: none
    transition: .25s
  > div.modal-content
    box-sizing: border-box;
    background-color: #333;
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
</style>

