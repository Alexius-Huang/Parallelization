<template>
  <ul
    class="ticket-list"
    @mouseup="handleListMouseUp($event)"
    @mouseenter="handleListMouseEnter($event)"
    @mouseleave="handleListMouseLeave($event)"
  >
    <li
      v-for="{
        id,
        description,
        epicId,
        title,
        point,
        boardId,
        boardState,
        createdAt,
      } in $props.tickets"
      :key="id"
      @mousedown="handleTicketMouseDown({ event: $event, id })"
    >
      <p>
        <span class="text-wrapper">
          {{ truncate(title, 40) }}
        </span>
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

        <span class="right-section">
          <span class="point">
            {{ point }}
          </span>
          <span class="btn-group-wrapper">
            <button @click="trigger(id)" :class="{ active: triggeredIds.includes(id) }">
              <img :src="icons.chevronLeft" alt="More Info of Ticket" />
            </button>
          </span>
        </span>
      </p>

      <div class="detail" :class="{ active: triggeredIds.includes(id) }">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
        <p>Created {{ timestampStringify(createdAt) }}</p>
      </div>
    </li>

    <li v-if="$props.tickets.length === 0" class="no-ticket">
      <p>{{ $props.noTicketMessage || 'Currently There Are No Tickets' }}</p>
    </li>
  </ul>
</template>

<script>
import Tag from '@/components/Tag';
import chevronLeft from '@/assets/chevron-left.svg';
import { timestampStringify } from '@/helpers/time';

export default {
  components: { Tag },
  props: ['tickets', 'no-ticket-message', 'board-id'],
  data() {
    return {
      icons: { chevronLeft },
      triggeredIds: [],
    };
  },
  computed: {
    epicsMap() { return this.$store.getters['epics/data']; },
    boardsMap() { return this.$store.getters['boards/data']; },
  },
  methods: {
    timestampStringify,
    truncate(string, length) {
      if (string.length > length) {
        return `${string.substring(0, length)}...`;
      }
      return string;
    },
    trigger(id) {
      if (this.triggeredIds.includes(id)) {
        const result = [...this.triggeredIds];
        result.splice(result.indexOf(id), 1);
        this.triggeredIds = result;
      } else {
        this.triggeredIds = [...this.triggeredIds, id];
      }
    },
    handleTicketMouseDown({ event, id }) {
      this.$emit('ticket-mousedown', { event, id });
    },
    handleListMouseUp($event) {
      const { boardId } = this.$props;
      this.$emit('list-mouseup', { event: $event, boardId });
    },
    handleListMouseEnter($event) {
      const { boardId } = this.$props;
      this.$emit('list-mouseenter', { event: $event, boardId });
    },
    handleListMouseLeave($event) {
      const { boardId } = this.$props;
      this.$emit('list-mouseleave', { event: $event, boardId });
    },
  },
};
</script>

<style scoped lang="sass">
@import '../sass/_shared.sass'

ul.ticket-list
  border: 1pt solid transparent
  box-sizing: border-box
  border-radius: 5pt
  > li
    // height: 24pt
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
      white-space: nowrap
      overflow: hidden
      @include vertical-align
      > span.right-section
        position: absolute
        right: 0
        transition: .25s
        > span.point
          vertical-align: top
          display: inline-block
          background-color: #555
          width: 30pt
          font-weight: 400
          font-family: 'Maven Pro', sans-serif
          text-align: center
        > span.btn-group-wrapper
          display: inline-block
          vertical-align: top
          > button
            @include vertical-align
            width: 20pt
            > img
              opacity: 0.3
            &:hover > img
              opacity: 0.6
            &.active
              transform: rotate(-90deg)

    > input.detail-trigger
      display: none
    > div.detail
      margin: 0 -10pt
      padding: 10pt
      background-color: #444
      border-top: 1pt solid #555
      display: none
      &.active
        display: block
        > h2
          font-size: 12pt
        > p
          margin-top: 5pt
          line-height: 1.5
          font-size: 10pt
</style>

