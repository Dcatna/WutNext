import React from 'react'
import { favs } from './Profile'
interface favProp {
    item : favs
}

const FavoritesList = ({item} : favProp) => {
  return (
    <div>{item.title}</div>
  )
}

export default FavoritesList