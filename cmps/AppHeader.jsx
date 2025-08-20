
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector, useDispatch } = ReactRedux

import { userService } from '../services/user.service.js'
import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'
import { SET_LOGGEDIN_USER } from '../store/store.js'


export function AppHeader() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.loggedinUser)

    function onSetUser(user) {
        if (user) dispatch({ type: SET_LOGGEDIN_USER, user })
        navigate('/')
    }

    function onLogout() {
        userService.logout()
            .then(() => {
                dispatch({ type: 'SET_LOGGEDIN_USER', user: null })
                navigate('/')
            })
            .catch(() => {
                showErrorMsg('OOPs try again')
            })
    }

    function getStyleByUser() {
        const prefs = {
            color: '',
            backgroundColor: ''
        }

        if (user && user.prefs) {
            prefs.color = user.prefs.color
            prefs.backgroundColor = user.prefs.bgColor
        }
        return prefs
    }

    return (
        <header style={getStyleByUser()} className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {user ? (
                    < section >
                        <Link to="/user">Hello {user.fullname}! Your balance is:{user.balance}
                        </Link>
                        <button onClick={onLogout}>Logout</button>
                    </ section >
                ) : (
                    <section>
                        <LoginSignup onSetUser={onSetUser} />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                    <NavLink to="/user" >User profile</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
