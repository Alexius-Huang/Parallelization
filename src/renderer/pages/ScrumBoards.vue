<template>
  <main>
    <h1>Scrum Boards</h1>
  
    <section class="scrum-boards">
      <ul>
        <li
          v-for="(column, i) in board.columns"
          :key="`${column}-${i}`"
        >
          <h2 class="column-header">{{ column }}</h2>

          <ul v-if="boardTicketsMap.get(i).length" class="column-list">
            <li
              v-for="({ title, description, epicId }) in boardTicketsMap.get(i)"
              :key="title"
            >
              <h3>{{ title }}</h3>
              <p class="tag" :style="{ 'background-color': epicsMap.get(epicId).color }">
                {{ epicsMap.get(epicId).title }}
              </p>
              <p class="description">{{ description }}</p>
            </li>
          </ul>
          <p v-else class="no-tickets">Currently there are no ticket in this state...</p>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
export default {
  computed: {
    epicsMap() { return this.$store.getters['epics/data']; },
    boardsMap() { return this.$store.getters['boards/data']; },
    boards() { return Array.from(this.boardsMap.values()); },
    board() { return this.boards[0]; },
    boardTicketsMap() {
      const ticketsMap = new Map();
      this.board.columns.forEach((_, i) => ticketsMap.set(i, []));
      this.board.tickets.forEach(ticket => ticketsMap.get(ticket.boardState).push(ticket));
      return ticketsMap;
    },
  },
};
</script>

<style scoped lang="sass">
main
  > h1
    width: 960px
    margin: 0 auto
    font-family: 'Roboto Mono', sans-serif
    font-size: 24pt
    height: 60pt
    line-height: 60pt
    font-weight: 100

  > section.scrum-boards
    width: 100vw
    height: auto
    > ul
      width: 100vw
      box-sizing: border-box
      overflow-x: auto
      white-space: nowrap
      text-align: center
      padding: 0 50pt
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
              letter-spacing: .8px
              display: none
              margin-top: 6px
              font-size: 9pt
              line-height: 14pt
            + li
              margin-top: 5pt
            &:hover
              > p.description
                display: block
        > p.no-tickets
          background-color: #222
          color: #777
          font-size: 10pt
          margin-top: 4pt
          padding: 5pt
          border-radius: 5pt
</style>
