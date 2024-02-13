import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Pages/Navbar/Navbar'
import { CurrentUserContext } from '../App'
import { supabase } from '../lib/supabaseClient'
import { UUID } from 'crypto'
import Moviebox from './Moviebox'
import FavoritesList from './FavoritesList'
export interface favs {
  movie_id: bigint
  poster_path: string
  title: string
  overview: string
  vote_average: number
}
const Profile = () => {
  const currentUserSession = useContext(CurrentUserContext) 
  const [favorites, setFavorites] = useState<favs[]>()
  useEffect(() => {
    getFavorites()
  }, [])

  async function getFavorites(){
    const {data, error} = await supabase.from("favoritemovies").select("*")
    if(error) {
      console.log(error)
    }
    console.log(data as favs[])
    setFavorites(data as favs[])

  }

  return (
    <div>
        <Navbar></Navbar>
        <div>
        {favorites?.map((fav) => [
          <FavoritesList item={fav}></FavoritesList>
        ])}
        </div>
    </div>
  )
}

export default Profile