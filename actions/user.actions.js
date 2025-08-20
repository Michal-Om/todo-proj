import { userService } from "../services/user.service.js"
import { SET_LOGGEDIN_USER, store } from "../store/store.js"

export function updateUser(userToUpdate) {
    return userService.updateUserPrefs(userToUpdate)
        .then((updatedUser) => {
            store.dispatch({
                type: SET_LOGGEDIN_USER, user: updatedUser
            })
        })
        .catch(err => {
            console.error('Cannot update user:', err)
            throw err
        })
}