<template>
  <main>
    <h1 class="title">Epics</h1>

    <section class="left">
      <ul class="epic-list">
        <li :class="{ active: isNaN(focusedEpicId) }">
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

        <ul v-if="tickets.length" class="ticket-list">
          <li
            v-for="{ id, epicId, title, point, boardId, boardState } in filteredTickets"
            :key="id"
          >
            <p>
              {{ title }}
              <span
                v-if="epicId !== -1"
                class="tag"
                :style="{
                  'background-color': epicsMap.get(epicId).color[0],
                  'color': epicsMap.get(epicId).color[1],
                }"
              >
                {{ epicsMap.get(epicId).title }}
              </span>

              <span
                v-if="boardId !== -1"
                class="tag"
                :style="{
                  'background-color': boardsMap.get(boardId).color[0],
                  'color': boardsMap.get(boardId).color[1],
                }"
              >
                {{ boardsMap.get(boardId).title }}
                <span class="inner-tag">
                  {{ boardsMap.get(boardId).columns[boardState] }}
                </span>
              </span>

              <span class="point">{{ point }}</span>
            </p>
          </li>
        </ul>

        <div v-else class="no-tickets">
          <p>Currently there are no tickets in this epic.</p>
        </div>

        <div class="btn-wrapper">
          <button
            class="new-ticket-btn"
            @click="modal.createNewTicket = true"
          >Create New Ticket</button>
        </div>
      </div>
    </section>

    <modal :class="{ closed: !modal.createNewEpic }" width="60vw">
      <div class="form-wrapper">
        <h1>Create New Epic</h1>
        <label>
          <p>Epic Title</p>
          <input
            v-model="inputs.createNewEpic.title"
            type="text"
            placeholder="Enter title of epic"
          />
        </label>

        <label>
          <p>Epic Description</p>
          <input
            v-model="inputs.createNewEpic.description"
            type="text"
            placeholder="Enter description of epic"
          />
        </label>

        <div class="btn-wrapper">
          <button @click="modal.createNewEpic = false">Cancel</button>
          <button @click="createNewEpic()">Submit</button>
        </div>
      </div>
    </modal>

    <modal :class="{ closed: !modal.createNewTicket }" width="60vw">
      <div class="form-wrapper new-ticket-form">
        <h1>Create New Ticket</h1>
        <label>
          <p>Title</p>
          <input
            v-model="inputs.createNewTicket.title"
            type="text"
            placeholder="Title of the ticket"
          />
        </label>

        <label>
          <p>Description</p>
          <input
            v-model="inputs.createNewTicket.description"
            type="text"
            placeholder="Description of the ticket"
          />
        </label>

        <label class="point-field">
          <p>Points</p>
          <input
            v-model="inputs.createNewTicket.point"
            type="text"
          />
        </label>

        <label class="assign-epic-field">
          <p>Epic</p>
          <select-input
            :options="epicOptions"
            :title="selectInput.createNewTicket.epicId.title"
            :value="selectInput.createNewTicket.epicId.value"
            @input="handleChangeEpicOption"
          />
        </label>

        <div class="btn-wrapper">
          <button @click="modal.createNewTicket = false">Cancel</button>
          <button @click="createNewTicket()">Submit</button>
        </div>
      </div>
    </modal>
  </main>
</template>

<script>
import Modal from '@/components/Modal';
import SelectInput from '@/components/SelectInput';
import add from '@/assets/add.svg';

export default {
  components: { Modal, SelectInput },
  data() {
    return {
      icons: { add },
      modal: {
        createNewEpic: false,
        createNewTicket: false,
      },
      inputs: {
        createNewEpic: {
          title: '',
          description: '',
        },
        createNewTicket: {
          title: '',
          description: '',
          point: '',
          epicId: -1,
        },
      },
      selectInput: {
        createNewTicket: {
          epicId: { title: 'Unassigned', value: -1 },
        },
      },
    };
  },
  computed: {
    epicsMap() { return this.$store.getters['epics/data']; },
    epics() { return Array.from(this.epicsMap.values()); },
    epicOptions() {
      const options = this.epics.map(({ title, id }) => ({ title, value: id }));
      return [{ title: 'Unassigned', value: -1 }].concat(options);
    },
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
      if (!Number.isNaN(this.focusedEpicId)) {
        return this.tickets.filter(({ epicId }) => epicId === this.focusedEpicId);
      }
      return this.tickets;
    },
  },
  methods: {
    async createNewEpic() {
      const { title, description } = this.inputs.createNewEpic;
      const input = {
        title: title.trim(),
        description: description.trim(),
      };

      await this.$store.dispatch('epics/create', input);
      this.inputs.createNewEpic.title = '';
      this.inputs.createNewEpic.description = '';
      this.modal.createNewEpic = false;
    },
    async createNewTicket() {
      const {
        title,
        description,
        point,
        epicId,
      } = this.inputs.createNewTicket;
      const input = {
        title,
        description,
        point,
        epicId,
      };
      await this.$store.dispatch('epics/tickets/create', input);
      this.inputs.createNewTicket.title = '';
      this.inputs.createNewTicket.description = '';
      this.inputs.createNewTicket.point = '';
      this.modal.createNewTicket = false;
    },
    async focusEpic(id) {
      const option = this.epicOptions.find(({ value }) => value === id);
      this.inputs.createNewTicket.epicId = option ? option.value : -1;
      this.selectInput.createNewTicket.epicId.title = option ? option.title : 'Unassigned';
      this.selectInput.createNewTicket.epicId.value = option ? option.value : -1;

      this.$store.commit('epics/setFocused', id);
    },
    handleChangeEpicOption({ title, value }) {
      this.inputs.createNewTicket.epicId = value;
      this.selectInput.createNewTicket.epicId.title = title;
      this.selectInput.createNewTicket.epicId.value = value;
    },
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

      > ul.ticket-list
        margin-top: 24px
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
          > p
            line-height: 24pt
            font-family: 'Roboto Mono', sans-serif
            font-size: 10pt
            position: relative
            > span.tag
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
              &.unassigned
                background-color: #333
                color: #777
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

div.modal-content
  > div.form-wrapper
    &.new-ticket-form
      > label.point-field
        width: 20%
      > label.assign-epic-field
        margin-left: 10pt
        width: calc(80% - 10pt)
</style>
