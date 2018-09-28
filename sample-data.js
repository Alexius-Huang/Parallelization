const colors = [
  ['#E53935', 'rgba(0, 0, 0, 0.84)'],
  ['#D81B60', 'rgba(0, 0, 0, 0.84)'],
  ['#8E24AA', 'rgba(0, 0, 0, 0.84)'],
  ['#5E35B1', 'rgba(255, 255, 255, 0.84)'],
  ['#3949AB', 'rgba(255, 255, 255, 0.84)'],
  ['#1E88E5', 'rgba(255, 255, 255, 0.84)'],
  ['#0097A7', 'rgba(255, 255, 255, 0.84)'],
  ['#00897B', 'rgba(255, 255, 255, 0.84)'],
  ['#43A047', 'rgba(255, 255, 255, 0.84)'],
  ['#558B2F', 'rgba(255, 255, 255, 0.84)'],
  ['#CDDC39', 'rgba(0, 0, 0, 0.84)'],
  ['#FDD835', 'rgba(0, 0, 0, 0.84)'],
  ['#FFB300', 'rgba(0, 0, 0, 0.84)'],
  ['#FB8C00', 'rgba(0, 0, 0, 0.84)'],
  ['#5D4037', 'rgba(255, 255, 255, 0.84)'],
  ['#455A64', 'rgba(255, 255, 255, 0.84)'],
];

const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
const boardIds = [-1, 1, 2, 3];
const randomBoardId = () => boardIds[Math.floor(Math.random() * boardIds.length)];
const boardState = [0, 1, 2];
const randomBoardState = () => boardState[Math.floor(Math.random() * boardState.length)];

module.exports = () => {
  const data = {
    epics: [],
    tickets: [],
    boards: [],
    messages: [],
  };

  for (let i = 1; i <= 3; i++) {
    data.boards.push({
      id: i,
      title: `Board - ${i}`,
      columns: ['TODO', 'On Progress', 'Completed'],
      color: randomColor(),
    });
  }

  for (let i = 1; i <= 5; i++) {
    data.epics.push({
      id: i,
      title: `Epic - ${i}`,
      description: `This is Epic - ${i}`,
      color: randomColor(),
    });

    for (let j = 1; j <= 5; j++) {
      const boardId = randomBoardId();
      data.tickets.push({
        epicId: i,
        id: ((i - 1) * 5) + j,
        boardId,
        boardState: boardId === -1 ? -1 : randomBoardState(),
        point: 1,
        title: 'Sample Ticket',
        description: 'Description of sample ticket',
      });
    }
  }

  return data;
};
