import React from 'react'
import MovieRated from '../../Components/HIghrated/MovieRated'
import ShowBoxRated from '../../Components/HIghrated/ShowBoxRated'
import ShowListRated from '../../Components/HIghrated/ShowListRated'

type Props = {}

  
const PopularScreen = (item: Props) => {
  return (
    <div>
        <div style={{
          marginBottom:'70px'
        }}>
          <MovieRated/>
        </div>
        <div>
          <p>SHOWS</p>
           <ShowListRated/>
        </div>

    </div>
  )
}

export default PopularScreen