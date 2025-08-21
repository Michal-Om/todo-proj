import { todoService } from "../services/todo.service.js"
import { userService } from "../services/user.service.js"
import { ADD_TODO, REMOVE_TODO, SET_LOGGEDIN_USER, SET_TODOS, store, UPDATE_TODO } from "../store/store.js"

export function loadTodos(filterBy) {
    return todoService.query(filterBy)
        .then(todos => store.dispatch({ type: SET_TODOS, todos }))
        .catch(err => {
            console.log('err:', err)
            throw err
        })
}

export function removeTodo(todoId) {
    const user = userService.getLoggedinUser()
    if (!user) return Promise.reject('User not logged in')

    //getState: read the current global state from Redux store.
    const todo = store.getState().todos.find(todo => todo._id === todoId)
    if (!todo) return Promise.reject('Todo not found')

    const activityTxt = `Removed todo: ${todo.txt}`

    return todoService.remove(todoId)
        .then(() => {
            store.dispatch({ type: REMOVE_TODO, todoId })

            return userService.addActivity(activityTxt, user)
                .then(userWithActivity => {
                    store.dispatch({ type: SET_LOGGEDIN_USER, user: userWithActivity })
                })
        })
}

export function saveTodo(todo) {
    const user = userService.getLoggedinUser()
    if (!user) return Promise.reject('User not logged in')

    const type = todo._id ? UPDATE_TODO : ADD_TODO
    const action = todo._id ? 'Updated' : 'Added'

    return todoService.save(todo)
        .then(savedTodo => {
            store.dispatch({ type, todo: savedTodo })

            let updatedUser = { ...user }
            let activityTxt = `${action} todo: ${savedTodo.txt}`

            if (savedTodo.isDone) {
                updatedUser = userService.updateUserBalance(updatedUser.balance + 10)
                activityTxt = `Completed todo: ${savedTodo.txt}`
            }

            return userService.addActivity(activityTxt, updatedUser)
                .then(userWithActivity => {
                    store.dispatch({ type: SET_LOGGEDIN_USER, user: userWithActivity })
                    return savedTodo
                })
        })
}