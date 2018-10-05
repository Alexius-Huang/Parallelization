<template>
  <section>
    <h2><img :src="icons.feedback" alt="Push Notifications"> Notifications</h2>
    <ul v-if="messages.length">
      <li
        v-for="{ id, type, message, info, createdAt } in messages"
        :key="id"
      >
        <div class="img-wrapper">
          <img :src="MessageIcons[type]" alt="Icon" class="icon" />
        </div>
        <div class="message-info">
          <p>{{ message }}</p>
          <p
            class="additional-info"
            v-for="({ title, content, type, color }, i) in info"
            :key="`${i}-${title || 'none'}`"
          >
            <span v-if="type === 'info'" class="info-wrapper">
              <img :src="icons.info" alt="Info icon" />
              <span v-if="title" class="text-wrapper" v-html="`${title} - ${content}`" />
              <span v-else class="text-wrapper" v-html="content" />
            </span>

            <span v-else-if="type === 'tag'" class="info-wrapper">
              <tag
                v-if="title"
                :title="title"
                :sub-title="content"
                :style="{
                  'background-color': color[0],
                  'color': color[1],
                }"        
              />
              <tag
                v-else
                :title="content"
                :style="{
                  'background-color': color[0],
                  'color': color[1],
                }"        
              />
            </span>
          </p>
          <p class="additional-info">
            <span class="info-wrapper">
              <img :src="icons.clock" alt="Notification Created At" />
              <span class="text-wrapper">{{ timestampStringify(createdAt) }}</span>
            </span>
          </p>
        </div>
      </li>
    </ul>

    <p v-else class="no-message">
      Currently there are no message ...
    </p>
  </section>
</template>

<script>
import Tag from '@/components/Tag';
import { MessageIcons } from '@/resources/message-types';
import clock from '@/assets/clock.svg';
import info from '@/assets/info.svg';
import feedback from '@/assets/feedback.svg';
import { timestampStringify } from '@/helpers/time';

export default {
  components: { Tag },
  data() {
    return {
      MessageIcons,
      icons: {
        clock,
        info,
        feedback,
      },
    };
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
@import '../../sass/_shared.sass'

section
  margin-top: -50pt
  height: 100vh
  width: calc(50% - 10pt)
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

  > p.no-message
    font-size: 12pt
    padding-left: 15pt
    color: rgba(255, 255, 255, 0.32)
  > ul
    height: calc(100vh - 110pt)
    overflow-y: auto
    box-sizing: border-box
    padding-bottom: 100pt
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
        background-color: #666
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
        background-color: #666
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
        border: 2pt solid #666
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
          &:first-child
            margin-bottom: 5pt
        > p.additional-info
          height: 20pt
          + p.additional-info
            margin-top: 1pt
          > span.info-wrapper
            display: inline-block
            height: 20pt
            @include vertical-align
            > span.text-wrapper
              font-size: 9pt
              color: rgba(255, 255, 255, 0.54)

            > img
              width: 12pt
              height: 12pt
              opacity: 0.4
              margin-right: 3pt
</style>
