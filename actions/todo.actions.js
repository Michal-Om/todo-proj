import { todoService } from "../services/todo.service.js"
import { ADD_TODO, REMOVE_TODO, SET_TODOS, store, UPDATE_TODO } from "../store/store.js"

export function loadTodos() {
    return todoService.query()
        .then(todos => store.dispatch({ type: SET_TODOS, todos }))
}

export function removeTodo(todoId) {
    return todoService.remove(todoId)
        .then(() => store.dispatch({ type: REMOVE_TODO, todoId }))
}

export function saveTodo(todoToSave) {
    const type = todoToSave._id ? UPDATE_TODO : ADD_TODO

    return todoService.save(todoToSave)
        .then(savedTodo => store.dispatch({ type, todo: savedTodo }))
}