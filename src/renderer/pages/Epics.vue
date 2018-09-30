<template>
  <main>
    <h1 class="title">Epics</h1>

    <section class="left">
      <ul class="epic-list">
        <li :class="{ active: focusedEpicId === -1 }">
          <button @click="focusEpic(-1)">All Tickets</button>
        </li>
        <li
          v-for="{ id, title, color } in epics"
          :key="id"
          :class="{ active: id === focusedEpicId }"
          :style="{ 'border-left-color': color[0] }"
        >
          <button
            @click="focusEpic(id)"
          >{{ title }}</button>
        </li>
      </ul>
    </section>

    <section class="right">
      <div class="content-wrapper">
        <h1>{{ focusedEpic.title }}</h1>
        <p>{{ focusedEpic.description }}</p>

        <div class="small-toolbar">
          <button
            @click="modal.createNewEpic = true"
          ><img :src="icons.add" alt="Create Epic" /></button>
        </div>

        <div
          v-if="focusedEpicId !== -1 && boards.length"
          v-for="{ id, title, color } in boards"
          :key="`${title}-${id}`"
          class="board-list-wrapper"
        >
          <h2 :style="{ 'border-left-color': color[0] }">{{ title }}</h2>
          <custom-ticket-list
            :tickets="
              filteredTicketsByEpic
                .filter(({ boardId }) => boardId === id)
            "
            :class="{ highlight: boardListHighlight === id }"
            :board-id="id"
            :no-ticket-message="`No tickets assigned in ${title} ...`"
            @ticket-mousedown="handleTicketMouseDown"
            @list-mouseup="handleListMouseUp"
            @list-mouseenter="handleListMouseEnter"
            @list-mouseleave="handleListMouseLeave"
          />
        </div>

        <div class="board-list-wrapper">
          <h2 v-if="focusedEpicId !== -1">Scrum Board Unassigned Tickets</h2>
          <custom-ticket-list
            v-if="tickets.length"
            :tickets="filteredTickets"
            :class="{ highlight: boardListHighlight === -1 }"
            :board-id="-1"
            :no-ticket-message="`No tickets left...`"
            @ticket-mousedown="handleTicketMouseDown"
            @list-mouseup="handleListMouseUp"
            @list-mouseenter="handleListMouseEnter"
            @list-mouseleave="handleListMouseLeave"
          />
        </div>

        <!-- <div v-else class="no-tickets">
          <p>Currently there are no tickets in this epic.</p>
        </div> -->

        <div class="btn-wrapper">
          <button
            class="new-ticket-btn"
            @click="modal.createNewTicket = true"
          >Create New Ticket</button>
        </div>
      </div>
    </section>

    <create-new-epic-modal
      :show="modal.createNewEpic"
      @close="modal.createNewEpic = false"
      @submit="createNewEpic"
    />

    <create-new-ticket-model
      ref="createNewTicketModal"
      :show="modal.createNewTicket"
      @close="modal.createNewTicket = false"
      @submit="createNewTicket"
    />

    <div
      v-if="focusedEpicId !== -1 && draggingTicket"
      class="dragged-list-item"
      :style="{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }"
    >
      <p>{{ draggedTicket.title }}</p>
      <tag
        v-if="draggedTicket.epicId !== -1"
        :style="{
          'background-color': epicsMap.get(draggedTicket.epicId).color[0],
          'color': epicsMap.get(draggedTicket.epicId).color[1],
        }"
        :title="epicsMap.get(draggedTicket.epicId).title"
      />
      <tag
        v-if="draggedTicket.boardId !== -1"
        :style="{
          'background-color': boardsMap.get(draggedTicket.boardId).color[0],
          'color': boardsMap.get(draggedTicket.boardId).color[1],
        }"
        :title="boardsMap.get(draggedTicket.boardId).title"
        :sub-title="boardsMap.get(draggedTicket.boardId).columns[draggedTicket.boardState]"
      />
      <p class="point">{{ draggedTicket.point }}</p>
    </div>
  </main>
</template>

<script>
import Modal from '@/components/Modal';
import SelectInput from '@/components/SelectInput';
import Tag from '@/components/Tag';
import CreateNewEpicModal from '@/pages/Epics/Modal.CreateNewEpic';
import CreateNewTicketModel from '@/pages/Epics/Modal.CreateNewTicket';
import CustomTicketList from '@/components/CustomTicketList';
import add from '@/assets/add.svg';

export default {
  components: {
    Modal,
    CreateNewEpicModal,
    CreateNewTicketModel,
    SelectInput,
    Tag,
    CustomTicketList,
  },
  data() {
    return {
      icons: { add },
      modal: {
        createNewEpic: false,
        createNewTicket: false,
      },
      draggingTicket: false,
      draggedTicketId: null,
      mousePosition: { x: 0, y: 0 },
      boardListHighlight: NaN,
    };
  },
  computed: {
    epicsMap() { return this.$store.getters['epics/data']; },
    epics() { return Array.from(this.epicsMap.values()); },
    focusedEpicId() { return this.$store.getters['epics/focused']; },
    focusedEpic() {
      return this.epicsMap.get(this.focusedEpicId) || {
        title: 'All Tickets',
        description: 'Browsing all the tickets in different epics',
      };
    },
    boardsMap() { return this.$store.getters['boards/data']; },
    boards() { return Array.from(this.boardsMap.values()); },
    ticketsMap() { return this.$store.getters['epics/tickets/data']; },
    tickets() { return Array.from(this.ticketsMap.values()); },
    filteredTickets() {
      if (this.focusedEpicId !== -1) {
        return this.filteredTicketsByEpic
          .filter(({ boardId }) => boardId === -1);
      }
      return this.tickets;
    },
    filteredTicketsByEpic() {
      return this.tickets.filter(({ epicId }) => epicId === this.focusedEpicId);
    },
    draggedTicket() {
      if (this.draggingTicket) {
        return this.ticketsMap.get(this.draggedTicketId);
      }
      return {};
    },
  },
  methods: {
    async createNewEpic(input) {
      await this.$store.dispatch('epics/create', input);
      this.modal.createNewEpic = false;
    },
    async createNewTicket(input) {
      await this.$store.dispatch('epics/tickets/create', input);
      this.modal.createNewTicket = false;
    },
    async focusEpic(id) {
      this.$store.commit('epics/setFocused', id);
      this.$refs.createNewTicketModal.changeEpicOption(id);
    },
    handleTicketMouseDown(value) {
      this.draggedTicketId = value.id;
      this.draggingTicket = true;
    },
    async handleListMouseUp(value) {
      if (this.draggingTicket && this.focusedEpicId !== -1) {
        const { draggedTicketId: id, $store: { dispatch } } = this;
        const { boardId } = value;
        if (boardId !== this.draggedTicket.boardId) {
          await dispatch('epics/tickets/assignToBoard', { id, boardId });
        }
        this.draggedTicketId = null;
        this.draggingTicket = false;
        this.boardListHighlight = NaN;
      }
    },
    handleListMouseEnter(value) {
      if (this.draggingTicket) {
        const { boardId } = value;
        this.boardListHighlight = boardId;
      }
    },
    handleListMouseLeave() {
      if (this.draggingTicket) {
        this.boardListHighlight = NaN;
      }
    },
    handleDocumentMouseMove(event) {
      if (this.draggingTicket) {
        const { pageX: x, pageY: y } = event;
        this.mousePosition = { x, y };
      }
    },
    handleDocumentMouseUp() {
      if (this.draggingTicket) {
        this.draggingTicket = false;
        this.draggedTicketId = null;
        this.boardListHighlight = NaN;
      }
    },
  },
  mounted() {
    document.addEventListener('mousemove', this.handleDocumentMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleDocumentMouseUp.bind(this));
  },
  destroyed() {
    document.removeEventListener('mousemove', this.handleDocumentMouseMove.bind(this));
    document.removeEventListener('mouseup', this.handleDocumentMouseUp.bind(this));
  },
};
</script>

<style scoped lang="sass">
@import '../sass/_shared.sass'
@import '../sass/_form.sass'

main
  width: 960px
  margin: 0 auto
  font-size: 0
  > h1.title
    font-family: 'Roboto Mono', sans-serif
    font-weight: 100
    font-size: 24pt
    height: 60pt
    line-height: 60pt
  > section.left
    display: inline-block
    width: 200px
    vertical-align: top
    > ul
      width: 100%
      > li
        box-sizing: border-box
        width: 100%
        border-left: 5pt solid
        > button
          line-height: 30pt
          display: block
          box-sizing: border-box
          padding: 0 10pt
          font-size: 12pt
          width: 100%
          color: rgba(255, 255, 255, 0.54)
          text-align: left
          font-weight: 100
          background-color: rgba(255, 255, 255, 0.1)
          transition: .25s
          &:hover
            color: white
            background-color: rgba(255, 255, 255, 0.2)
            transition: .25s
        + li
          margin-top: 2px

        &.active
          background-color: rgba(255, 255, 255, 0.2)

  > section.right
    vertical-align: top
    display: inline-block
    width: 730px
    margin-left: 30px
    background-color: #444
    position: relative
    > div.content-wrapper
      padding: 110pt 20pt 100pt 20pt
      box-sizing: border-box
      position: absolute
      left: 0
      top: -110pt
      height: 100vh
      overflow-y: auto
      width: 100%
      background-color: #444
      > h1
        font-size: 22pt
        font-weight: 100
        margin-bottom: 30px
      > p
        font-size: 12pt
        line-height: 1.7
        letter-spacing: .6px

      > div.small-toolbar
        position: absolute
        right: 20pt
        top: 110pt
        > button
          @include vertical-align
          width: 30pt
          height: 30pt
          &:hover
            background-color: #555
            border-radius: 50%
          > img
            width: 100%
            height: 100%

      > div.board-list-wrapper
        > h2
          font-size: 14pt
          margin-top: 24px
          font-weight: 400
          border-left: 3pt solid
          padding-left: 10pt
        > ul.ticket-list
          margin-top: 12px
          transition: .25s
          &.highlight
            transition: .25s
            border-color: rgba(255, 255, 255, 0.54)

        + div.board-list-wrapper
          margin-top: 36px

      > div.no-tickets
        margin-top: 12pt
        > p
          font-size: 10pt
          color: rgba(255, 255, 255, 0.27)

      > div.btn-wrapper
        text-align: right
        margin-top: 15pt
        > button
          height: 30pt
          line-height: 30pt
          font-size: 10pt
          padding: 0 10pt
          color: rgba(255, 255, 255, 0.54)
          background-color: #555
          &:hover
            background-color: #666

  > div.dragged-list-item
    position: fixed
    pointer-events: none
    height: 24pt
    background-color: rgba(255, 255, 255, 0.72)
    color: rgba(0, 0, 0, 0.54)
    padding: 0 12pt
    border-radius: 5pt
    white-space: nowrap
    transform: translate(-50%, -50%)
    @include vertical-align
    > p
      font-family: 'Roboto Mono', sans-serif
      font-size: 10pt

    > span.tag
      margin-left: 6pt

    > p.point
      background-color: rgba(255, 255, 255, 0.84)
      width: 25pt
      margin-left: 12pt
      height: 100%
      line-height: 24pt
      text-align: center

</style>
