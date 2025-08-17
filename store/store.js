const { createStore } = Redux

const initialState = {
    todos: [],
    isLoading: false,
    filterBy: null,
    user: null
}

export function appReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {

        default:
            return state
    }
}

export const store = createStore(appReducer)
window.gStore = store