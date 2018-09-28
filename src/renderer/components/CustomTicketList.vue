<template>
  <ul class="ticket-list">
    <li
      v-for="{ id, epicId, title, point, boardId, boardState } in $props.tickets"
      :key="id"
    >
      <p>
        {{ title }}
        <tag
          v-if="epicId !== -1"
          :style="{
            'background-color': epicsMap.get(epicId).color[0],
            'color': epicsMap.get(epicId).color[1],
          }"
          :title="epicsMap.get(epicId).title"
        />
        <tag
          v-if="boardId !== -1"
          :style="{
            'background-color': boardsMap.get(boardId).color[0],
            'color': boardsMap.get(boardId).color[1],
          }"
          :title="boardsMap.get(boardId).title"
          :sub-title="boardsMap.get(boardId).columns[boardState]"
        />

        <span class="point">{{ point }}</span>
      </p>
    </li>

    <li v-if="$props.tickets.length === 0" class="no-ticket">
      <p>{{ $props.noTicketMessage || 'Currently There Are No Tickets' }}</p>
    </li>
  </ul>
</template>

<script>
import Tag from '@/components/Tag';

export default {
  components: { Tag },
  props: ['tickets', 'no-ticket-message'],
  computed: {
    epicsMap() { return this.$store.getters['epics/data']; },
    boardsMap() { return this.$store.getters['boards/data']; },
  },
};
</script>

<style scoped lang="sass">
ul.ticket-list
  // margin-top: 24px
  > li
    height: 24pt
    padding: 0 10pt
    border-left: 1pt solid #555
    border-right: 1pt solid #555
    border-bottom: 1pt solid #555
    &:first-child
      border-top-left-radius: 5px
      border-top-right-radius: 5px
      border-top: 1pt solid #555
    &:last-child
      border-bottom-left-radius: 5px
      border-bottom-right-radius: 5px
    &:hover
      background-color: #555
      transition: .25s
      > p > span.point
        background-color: #666
        transition: .25s
    &.no-ticket
      text-align: center
      background-color: rgba(0, 0, 0, 0.05)
      color: rgba(255, 255, 255, 0.3)
      border-color: rgba(0, 0, 0, 0.1)
      > p
        font-size: 8pt
    > p
      line-height: 24pt
      font-family: 'Roboto Mono', sans-serif
      font-size: 10pt
      position: relative
      > span.point
        position: absolute
        right: 0
        font-weight: 400
        font-family: 'Maven Pro', sans-serif
        background-color: #555
        width: 30pt
        text-align: center
        display: inline-block
        transition: .25s
</style>

