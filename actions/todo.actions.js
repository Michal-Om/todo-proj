import { todoService } from "../services/todo.service.js"
import { userService } from "../services/user.service.js"
import { ADD_TODO, REMOVE_TODO, SET_TODOS, store, UPDATE_TODO } from "../store/store.js"

export function loadTodos() {
    return todoService.query()
        .then(todos => store.dispatch({ type: SET_TODOS, todos }))
}

export function removeTodo(todoId) {
    return todoService.remove(todoId)
        .then(() => store.dispatch({ type: REMOVE_TODO, todoId }))
}

export function saveTodo(todo) {
    const user = userService.getLoggedinUser()
    if (!user) return Promise.reject('User not logged in')

    const type = todo._id ? UPDATE_TODO : ADD_TODO
    const action = todo._id ? 'Updated' : 'Added'
    return todoService.save(todo)
        .then(savedTodo => {
            store.dispatch({ type, todo: savedTodo })

            userService.addActivity(`${action} todo: ${savedTodo.txt}`)
            return savedTodo
        })
}