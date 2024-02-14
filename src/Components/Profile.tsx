import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Pages/Navbar/Navbar'
import { CurrentUserContext } from '../App'
import { supabase } from '../lib/supabaseClient'
import { UUID } from 'crypto'
import Moviebox from './Moviebox'
import FavoritesList from './FavoritesList'
import { Link } from 'react-router-dom'
import user_image from './user_default.jpg'
export interface favs {
  movie_id: bigint
  poster_path: string
  title: string
  overview: string
  vote_average: number
}
const Profile = () => {
  const currentUserSession = useContext(CurrentUserContext) 

  return (
    <div className='overflow-x-hidden'>
      <Navbar></Navbar>
      <div className="bg-white shadow-lg rounded-lg p-4 max-w-sm mx-auto mt-10">
        <div className="flex justify-center">
          <img className="rounded-full h-24 w-24 border-2 border-gray-300" src={user_image} alt="profile picture" />
          <h2 className="mt-7 ml-4 text-center text-xl font-semibold text-black ">{currentUserSession?.user.email}</h2>
        </div>
          
        </div>
      <div>
        <Link to = "/favorites">Favorites List</Link>
      </div>
    </div>
  )
}

export default Profile