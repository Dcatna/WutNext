import React from 'react'
import { Cast } from '../data/types/types'
import user_image from './user_default.jpg'

interface movieactor {
    actor : Cast
}

const ActorBox = ({actor} : movieactor) => {
    let imageUrl = ""
    console.log(actor.profile_path)
    if(actor.profile_path === null) {
        imageUrl = user_image
    }
    else{
        imageUrl = `https://image.tmdb.org/t/p/w500${actor.profile_path}`
    }
    
  return (
    <div>
        <img src={imageUrl} alt="Actor Picutre" />
        <p>{actor.name}</p>
    </div>
  )
}

export default ActorBox