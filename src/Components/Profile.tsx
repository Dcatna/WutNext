import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Pages/Navbar/Navbar'
import { CurrentUserContext } from '../App'
import { supabase } from '../lib/supabaseClient'
import { UUID } from 'crypto'
import Moviebox from './Moviebox'
import FavoritesList from './FavoritesList'
import { Link } from 'react-router-dom'
import user_image from './user_default.jpg'
import { Button } from './Button'
import UserFavMovies from './ProfileNav/UserFavMovies'
import UserFavShows from './ProfileNav/UserFavShows'
import UserProfile from './ProfileNav/UserProfile'
import UserPreferences from './ProfileNav/UserPreferences'
import { UserSearch } from 'lucide-react'
import UserSettings from './ProfileNav/UserSettings'
import UserActivity from './ProfileNav/UserActivity'
import UserLists from './ProfileNav/UserLists'

export interface favs {
  _id: number
  user_id : number
  poster_path: string
  title: string
  overview: string
  vote_average: number
  movie_id : number
  show_id : number
}

type Screens = "MOVIE" | "SHOW" | "PROFILE" | "ACTIVITY" | "PREFERENCES" | "SETTINGS" | "LISTS"

const Profile = () => {
  const currentUserSession = useContext(CurrentUserContext) 
  const [currScreen, setCurrScreen] = useState<Screens>("PROFILE")
  console.log(currentUserSession?.user.id)
  return (
    <div className='overflow-x-hidden'>
      <div className="bg-white shadow-lg rounded-lg p-4 max-w-sm mx-auto mt-10">
        <div className="flex justify-center">
          <img className="rounded-full h-24 w-24 border-2 border-gray-300" src={user_image} alt="profile picture" />
          <h2 className="mt-7 ml-4 text-center text-xl font-semibold text-black ">{currentUserSession?.user.email?.slice(0, currentUserSession?.user.email?.indexOf("@"))}</h2>
        </div>
          
        </div>
    <div className='mt-10'>
      <div className='items-center justify-center flex'>
        <div>
          <Button onClick={() => setCurrScreen("PROFILE")} variant="ghost">
              Profile
          </Button>
          <Button onClick={() => setCurrScreen("MOVIE")} variant="ghost" className="rounded-md">
              Favorite Movies
          </Button>
          <Button onClick={() => setCurrScreen("SHOW")} variant="ghost" className="rounded-md">
              Favorites Shows
          </Button>
          <Button onClick={() => setCurrScreen("ACTIVITY")} variant="ghost" className="rounded-md">
              Activity
          </Button>
          <Button onClick={() => setCurrScreen("PREFERENCES")} variant="ghost" className="rounded-md">
              Preferences
          </Button>
          <Button onClick={() => setCurrScreen("LISTS")} variant="ghost" className="rounded-md">
              Lists
          </Button>
          <Button onClick={() => setCurrScreen("SETTINGS")} variant="ghost" className="rounded-md">
              Settings
          </Button>
        </div>
      </div>
        <div className='' style={{marginLeft:"400px"}}>
          {currScreen === "MOVIE" && <UserFavMovies/>}
          {currScreen === "SHOW" && <UserFavShows/>}
          {currScreen === "PROFILE" && <UserProfile/>}
          {currScreen === "PREFERENCES" && <UserPreferences/>}
          {currScreen === "ACTIVITY" && <UserActivity/>}
          {currScreen === "SETTINGS" && <UserSettings/>}
          {currScreen === "LISTS" && <UserLists/>}
        </div>
      </div>
    </div>
  )
}

export default Profile

