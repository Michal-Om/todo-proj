const { createStore } = Redux


export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'

export const SET_LOGGEDIN_USER = 'SET_LOGGEDIN_USER'

const initialState = {
    todos: [],
    isLoading: false,
    filterBy: null,
    loggedinUser: null
}

export function appReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_TODOS:
            return { ...state, todos: cmd.todos }

        case REMOVE_TODO:
            var todos = state.todos.filter(todo => todo._id !== cmd.todoId)
            return { ...state, todos }

        case ADD_TODO:
            return { ...state, todos: [...state.todos, cmd.todo] }

        case UPDATE_TODO:
            var todos = state.todos.map(todo => todo._id === cmd.todo._id ? cmd.todo : todo)
            return { ...state, todos }
        case SET_LOGGEDIN_USER:
            return { ...state, loggedinUser: cmd.user }
        default:
            return state
    }
}

export const store = createStore(appReducer)
window.gStore = store