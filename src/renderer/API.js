const PORT = 3000;
const URL = `http://localhost:${PORT}`;

export function fetchEpics() {
  return fetch(`${URL}/epics`)
    .then(response => response.json());
}

export function createEpic(data) {
  return fetch(`${URL}/epics`, {
    body: JSON.stringify({ ...data, createdAt: Date.now() }),
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
    body: JSON.stringify({ ...data, createdAt: Date.now() }),
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

export function fetchMessages({ page, limit = 10 }) {
  return fetch(`${URL}/messages?_page=${page}&_limit=${limit}&_sort=createdAt&_order=desc`)
    .then(response => response.json());
}

export function lastMessage() {
  return fetch(`${URL}/messages?_sort=createdAt&_order=desc&_limit=1`)
    .then(response => response.json());
}

export function createMessage(data) {
  return fetch(`${URL}/messages`, {
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' },
    method: 'POST',
  }).then(response => response.json());
}

export function updateMessage(id, data, method = 'PATCH') {
  return fetch(`${URL}/messages/${id}`, {
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' },
    method,
  }).then(response => response.json());
}
