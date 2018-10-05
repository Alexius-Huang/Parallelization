<template>
  <main>
    <h1>Scrum Boards</h1>

    <section class="scrum-boards-list">
      <ul>
        <li
          v-for="{ title, id, color } in boards"
          :key="`${title}-${id}`"
          :class="{ active: id === focusedBoardId }"
        >
          <button
            :style="{ 'border-left-color': color[0] }"
            @click="focusBoard(id)"
          >{{ title }}</button>
        </li>

        <li>
          <button
            :style="{ 'border-left': 'none' }"
            @click="modal.createNewBoard = true"
          ><img :src="icons.add" alt="Create Scrum Board" /></button>
        </li>
      </ul>
    </section>

    <create-new-board-modal
      :show="modal.createNewBoard"
      @close="modal.createNewBoard = false"
      @submit="createNewBoard"
    />

    <section class="scrum-boards">
      <ul>
        <li
          v-for="(column, i) in board.columns"
          :key="`${column}-${i}`"
        >
          <h2 class="column-header">{{ column }}</h2>

          <ul v-if="boardTicketsMap.get(i).length" class="column-list">
            <li
              v-for="({ title, description, epicId, id: ticketId, point }) in boardTicketsMap.get(i)"
              :key="`${title}-${ticketId}`"
            >
              <span class="point">{{ point }}</span>
              <h3>{{ title }}</h3>
              <p
                class="tag"
                :style="{
                  'background-color': epicsMap.get(epicId).color[0],
                  'color': epicsMap.get(epicId).color[1],
                }"
              >
                {{ epicsMap.get(epicId).title }}
              </p>
              <p class="description">{{ description }}</p>

              <div class="btn-group">
                <button
                  @click="firstState(ticketId)"
                  :disabled="i === 0"
                ><img :src="icons.firstPage" alt="First State" /></button>
                <button
                  @click="previousState(ticketId)"
                  :disabled="i === 0"
                ><img :src="icons.chevronLeft" alt="Previous State" /></button>
                <button
                  @click="nextState(ticketId)"
                  :disabled="i === board.columns.length - 1"
                ><img :src="icons.chevronRight" alt="Next State" /></button>
                <button
                  @click="lastState(ticketId)"
                  :disabled="i === board.columns.length - 1"
                ><img :src="icons.lastPage" alt="Last State" /></button>
              </div>
            </li>
          </ul>
          <p v-else class="no-tickets">Currently there are no ticket in this state...</p>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
import CreateNewBoardModal from '@/pages/ScrumBoards/Modal.CreateNewBoard';
import chevronLeft from '@/assets/chevron-left.svg';
import chevronRight from '@/assets/chevron-right.svg';
import firstPage from '@/assets/first-page.svg';
import lastPage from '@/assets/last-page.svg';
import add from '@/assets/add.svg';

export default {
  components: {
    CreateNewBoardModal,
  },
  data() {
    return {
      icons: {
        chevronLeft,
        chevronRight,
        firstPage,
        lastPage,
        add,
      },
      modal: { createNewBoard: false },
    };
  },
  computed: {
    epicsMap() { return this.$store.getters['epics/data']; },
    ticketsMap() { return this.$store.getters['epics/tickets/data']; },
    tickets() { return Array.from(this.ticketsMap.values()); },
    boardsMap() { return this.$store.getters['boards/data']; },
    boards() { return Array.from(this.boardsMap.values()); },
    focusedBoardId() { return this.$store.getters['boards/focused']; },
    board() { return this.boardsMap.get(this.focusedBoardId) || { columns: [] }; },
    boardTickets() { return this.tickets.filter(({ boardId }) => boardId === this.board.id); },
    boardTicketsMap() {
      const ticketsMap = new Map();
      this.board.columns.forEach((_, i) => ticketsMap.set(i, []));
      this.boardTickets.forEach(ticket => ticketsMap.get(ticket.boardState).push(ticket));
      return ticketsMap;
    },
  },
  methods: {
    async createNewBoard(input) {
      await this.$store.dispatch('boards/create', input);
      this.modal.createNewBoard = false;
    },
    nextState(ticketId) {
      this.$store.dispatch('epics/tickets/nextState', { id: ticketId });
    },
    previousState(ticketId) {
      this.$store.dispatch('epics/tickets/previousState', { id: ticketId });
    },
    firstState(ticketId) {
      this.$store.dispatch('epics/tickets/update', {
        id: ticketId,
        mutation: ticket => ({ ...ticket, boardState: 0 }),
      });
    },
    lastState(ticketId) {
      const boardState = this.board.columns.length - 1;
      this.$store.dispatch('epics/tickets/update', {
        id: ticketId,
        mutation: ticket => ({ ...ticket, boardState }),
      });
    },
    focusBoard(id) {
      this.$store.commit('boards/setFocused', id);
    },
  },
};
</script>

<style scoped lang="sass">
@import '../sass/_shared.sass'

main
  > h1
    width: 960px
    margin: 0 auto
    font-family: 'Roboto Mono', sans-serif
    font-size: 24pt
    height: 60pt
    line-height: 60pt
    font-weight: 100

  > section.scrum-boards-list
    width: 960px
    margin: 0 auto
    > ul
      width: 100%
      > li
        display: inline-block
        vertical-align: top
        font-size: 0
        height: 30pt
        + li
          margin-left: 10pt
        &.active
          > button
            background-color: #555
        > button
          padding: 0 10pt
          border-left: 5pt solid
          font-family: 'Roboto Mono', sans-serif
          font-weight: 100
          height: 30pt
          line-height: 30pt
          font-size: 12pt
          display: inline-block
          color: rgba(255, 255, 255, 0.54)
          background-color: #444
          @include vertical-align
          &:hover
            background-color: #555

  > section.scrum-boards
    margin-top: 20pt
    width: 100vw
    height: auto
    > ul
      width: 100vw
      box-sizing: border-box
      overflow-x: auto
      white-space: nowrap
      text-align: center
      padding: 20pt 50pt
      box-shadow: inset 0pt 15pt 8pt -10pt #222
      &::-webkit-scrollbar
        display: none
      > li
        width: 200pt
        display: inline-block
        vertical-align: top
        + li
          margin-left: 20pt
        > h2.column-header
          font-family: 'Roboto Mono', sans-serif
          font-size: 12pt
          text-align: left
          padding: 0 4pt
          font-weight: 100
        > ul.column-list
          margin-top: 4pt
          background-color: #444
          padding: 5pt
          border-radius: 5pt

          > li
            text-align: left
            background-color: #555
            width: 100%
            box-sizing: border-box
            padding: 5pt
            border-radius: 5pt
            white-space: normal
            position: relative
            + li
              margin-top: 5pt
            &:hover
              > p.description
                display: block
              > div.btn-group
                display: block

            > span.point
              display: inline-block
              position: absolute
              border-top-right-radius: 5pt
              border-bottom-left-radius: 5pt
              right: 0
              top: 0
              background-color: #333
              font-size: 10pt
              height: 15pt
              line-height: 15pt
              padding: 0 5pt

            > h3
              font-size: 10pt
              letter-spacing: 0.8px
              word-spacing: 1px
            > p.tag
              margin-top: 6px
              display: inline-block
              font-size: 9pt
              line-height: 16pt
              border-radius: 3pt
              padding: 0 7pt
            > p.description
              letter-spacing: .3px
              display: none
              margin-top: 10px
              font-size: 9pt
              line-height: 14pt
            > div.btn-group
              height: 20pt
              width: 100%
              font-size: 0
              margin-top: 10px
              display: none
              > button
                // background-color: rgba(255, 255, 255, 0.1)
                display: inline-block
                width: 25%
                height: 20pt
                line-height: 20pt
                text-align: center
                &:hover
                  background-color: rgba(255, 255, 255, 0.2)
                &:disabled
                  // background-color: rgba(255, 255, 255, 0.05)
                  > img
                    opacity: 0.54

        > p.no-tickets
          background-color: #222
          color: #777
          font-size: 10pt
          margin-top: 4pt
          padding: 5pt
          border-radius: 5pt
</style>
