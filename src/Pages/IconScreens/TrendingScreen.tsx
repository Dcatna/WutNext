import React from 'react'
import Movieboxlist from '../../Components/MovieboxList'
import ShowboxList from '../../Components/ShowboxList'

type Props = {}

const TrendingScreen = (props: Props) => {
  return (
    <div>
        <div style={{
          marginBottom:'70px'
        }}>
          <Movieboxlist></Movieboxlist>
        </div>
        <div>
          <p>SHOWS</p>
          <ShowboxList></ShowboxList>
        </div>
    </div>
  )
}

export default TrendingScreen