<template>
  <main>
    <section class="messages">
      <h2>Notifications</h2>
      <ul>
        <li
          v-for="{ id, type, message, createdAt } in messages"
          :key="id"
        >
          <div class="img-wrapper">
            <img :src="MessageIcons[type]" alt="Icon" class="icon" />
          </div>
          <div class="message-info">
            <p>{{ message }}</p>
            <p class="time">
              <img :src="icons.clock" alt="Notification Created At" />
              <span class="text-wrapper">{{ timestampStringify(createdAt) }}</span>
            </p>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
import { MessageIcons } from '@/resources/message-types';
import clock from '@/assets/clock.svg';
import { timestampStringify } from '@/helpers/time';

export default {
  data() {
    return { MessageIcons, icons: { clock } };
  },
  computed: {
    messages() { return this.$store.getters['messages/data']; },
  },
  methods: {
    timestampStringify,
  },
};
</script>

<style scoped lang="sass">
@import '../sass/_shared.sass'

main
  width: 960px
  margin: 0 auto
  padding: 
  > section
    > h2
      line-height: 60pt
      font-family: 'Roboto Mono', sans-serif
      font-weight: 100

  > section.messages
    width: 50%
    > ul
      height: calc(100vh - 110pt)
      overflow-y: auto
      > li
        box-sizing: border-box
        padding: 0 5pt
        font-size: 0
        border-radius: 5pt
        position: relative
        &:before
          content: ''
          display: inline-block
          position: absolute
          width: 2pt
          height: calc(100% - 10pt)
          background-color: #555
          left: 14pt
          top: 30pt
        + li
          margin-top: 20pt
        &:last-child:after
          content: ''
          display: inline-block
          width: 10pt
          height: 10pt
          border-radius: 10pt
          background-color: #555
          position: absolute
          left: 10pt
          bottom: -25pt

        > div.img-wrapper
          position: absolute
          width: 30pt
          height: 30pt
          left: 0
          top: 0
          text-align: center
          border-radius: 15pt
          border: 2pt solid #555
          box-sizing: border-box
          @include vertical-align
          > img.icon
            width: 16pt
            height: 16pt

        > div.message-info
          padding: 6pt 0 5pt 30pt
          > p
            font-size: 12pt
            line-height: 1.5
          > p.time
            height: 20pt
            @include vertical-align
            > span.text-wrapper
              font-size: 9pt
              color: rgba(255, 255, 255, 0.32)

            > img
              width: 12pt
              height: 12pt
              opacity: 0.4
              margin-right: 3pt

</style>
