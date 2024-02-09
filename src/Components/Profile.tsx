import React, { useContext } from 'react'
import Navbar from '../Pages/Navbar/Navbar'
import { CurrentUserContext } from '../App'

const Profile = () => {
  const currentUserSession = useContext(CurrentUserContext)
  return (
    <div>
        <Navbar></Navbar>
        <div>
            {currentUserSession?.user.email}
        </div>
    </div>
  )
}

export default Profile