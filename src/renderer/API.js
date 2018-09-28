const PORT = 3000;
const URL = `http://localhost:${PORT}`;

export function fetchEpics() {
  return fetch(`${URL}/epics`)
    .then(response => response.json());
}

export function createEpic(data) {
  return fetch(`${URL}/epics`, {
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' },
    method: 'POST',
  }).then(response => response.json());
}

export function fetchTickets(epicId = null) {
  if (epicId === null) {
    return fetch(`${URL}/tickets`)
      .then(response => response.json());
  }
  return fetch(`${URL}/tickets?epicId=${epicId}`)
    .then(response => response.json());
}

export function createTicket(data) {
  return fetch(`${URL}/tickets`, {
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' },
    method: 'POST',
  }).then(response => response.json());
}

export function updateTicket(id, data, method = 'PATCH') {
  return fetch(`${URL}/tickets/${id}`, {
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' },
    method,
  }).then(response => response.json());
}

export function fetchBoards() {
  return fetch(`${URL}/boards`)
    .then(response => response.json());
}
