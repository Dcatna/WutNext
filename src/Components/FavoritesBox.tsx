import React, { useContext, useState } from 'react'
import { favs } from './Profile'
import { supabase } from '../lib/supabaseClient'
import { CurrentUserContext } from '../App'
import { Link } from 'react-router-dom'
interface favProp {
    item : favs
}

const FavoritesBox = ({item} : favProp) => {
  const partial_url = "https://image.tmdb.org/t/p/original/"
    const client = useContext(CurrentUserContext)
    const [loaded, setLoaded] = useState(false)

  return (
    <div className="image-container" style={{ width: '150px', height: '250px', position: 'relative' }}>
    <Link to={'/info'} state={{ item }}>
        <img
            onLoad={() => setLoaded(true)}
            src={partial_url + item.poster_path}
            alt="Movie Poster"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {loaded && (
            <div className="image-title" style={{ position: 'absolute', bottom: '0', left: '0', padding: '10px' }}>
                {item.title}
            </div>
        )}
    </Link>
</div>
  )
}

export default FavoritesBox