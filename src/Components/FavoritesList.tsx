import React, { useEffect, useState } from 'react'
import { favs } from './Profile'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../Pages/Navbar/Navbar'
import FavoritesBox from './FavoritesBox'

const FavoritesList = () => {
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
          <FavoritesBox item={fav}></FavoritesBox>
        ])}
        </div>
    </div>
  )
}

export default FavoritesList