export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function deriveSettersFromState(stateObject) {
  return Object.keys(stateObject).reduce(
    (acc, key) => Object.assign(acc, {
      [`set${capitalize(key)}`](state, payload) {
        state[key] = payload;
      },
    }),
    {},
  );
}

export function deriveGettersFromState(stateObject) {
  return Object.keys(stateObject).reduce(
    (acc, key) => Object.assign(acc, {
      [key]: state => state[key],
    }),
    {},
  );
}

export function injectMutations(stateObject, mutations = {}) {
  return Object.assign(deriveSettersFromState(stateObject), mutations);
}

export function injectGetters(stateObject, getters = {}) {
  return Object.assign(deriveGettersFromState(stateObject), getters);
}
