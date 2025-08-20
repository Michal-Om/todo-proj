const { useNavigate, Link } = ReactRouterDOM
const { useState, useEffect } = React
const { useSelector } = ReactRedux

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { updateUser } from '../actions/user.actions.js'
import { ActivityList } from '../cmps/ActivityList.jsx'

export function UserDetails() {
    const loggedInUser = useSelector(state => state.loggedinUser)
    const [userDetails, setUserDetails] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (loggedInUser) loadUserData()
    }, [])

    function loadUserData() {
        setUserDetails({
            fullname: loggedInUser.fullname || '',
            color: loggedInUser.prefs.color || '#000000',
            bgColor: loggedInUser.prefs.bgColor || '#ffffff',
            activities: loggedInUser.activities || []
        })
    }

    function onEditUser(ev) {
        ev.preventDefault()
        const userToUpdate = {
            fullname: userDetails.fullname,
            prefs: { color: userDetails.color, bgColor: userDetails.bgColor }
        }
        updateUser(userToUpdate)
            .then(() => showSuccessMsg('User updated successfully!'))
            .catch(err => {
                console.error('Cannot update user', err)
                showErrorMsg('Cannot update user')
            })

    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setUserDetails(prevUser => ({ ...prevUser, [field]: value }))
    }

    if (!loggedInUser || !userDetails) return <div>No User</div>
    const { fullname, color, bgColor, activities } = userDetails

    return <section className='user-details'>
        <h1>Profile</h1>
        <form onSubmit={onEditUser}>
            <label htmlFor='fullname'>Name:</label>
            <input type="text" id="fullname" name="fullname" value={fullname}
                onChange={handleChange}
                placeholder='Full Name'
            />
            <label htmlFor='color'>Font Color:</label>
            <input type="color" name="color"
                value={color} onChange={handleChange}
            />
            <label htmlFor='bgColor'>BG Color:</label>
            <input type="color" name="bgColor"
                value={bgColor}
                onChange={handleChange}
            />
            <button type="submit">Save</button>
        </form>
        {activities &&
            <ActivityList activities={activities} />
        }
        <Link to="/" className="back-home">Back Home</Link>
    </section>

}