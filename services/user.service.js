
import { storageService } from "./async-storage.service.js"


export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    addActivity,
    updateUserBalance
}
const STORAGE_KEY_LOGGEDIN = 'user' // for session storage currently logged in user
const STORAGE_KEY = 'userDB' // for local storage, all users db

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(user => user.username === username && user.password === password)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname }) {
    const user = {
        username,
        password,
        fullname,
        balance: 10000,
        activities: []
    }
    user.createdAt = user.updatedAt = Date.now()

    return storageService.post(STORAGE_KEY, user)
        .then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
    const userToSave = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        balance: user.balance || 10000,
        activities: user.activities || []
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'muki',
        password: 'muki1',
        balance: 10000,
        activities: []
    }
}

function addActivity(txt, user = null) {
    const currUser = user || getLoggedinUser()
    if (!currUser) return Promise.reject('User not logged in')

    if (!currUser.activities) currUser.activities = []
    currUser.activities.push({ txt, at: Date.now() })

    return storageService.put(STORAGE_KEY, currUser)
        .then(() => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(currUser))
            console.log('Activities:', currUser.activities)
            return currUser //updated user
        })
}

function updateUserBalance(newBalance) {
    const user = getLoggedinUser()
    if (!user) return null
    user.balance = newBalance
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(user))
    return user
}

// signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// login({username: 'muki', password: 'muki1'})

// Data Model:
// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999
// }