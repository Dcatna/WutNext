//https://vidsrc.to/embed/tv/tt0944947
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { movieBoxProp } from './Moviebox'
import { showBoxProp } from './Showbox'
type Props = {}

const WatchShow = (props: Props) => {
    const location = useLocation()
    const show : showBoxProp = location.state

  return (
    <div>
        <div className='items-center justify-center flex mt-10'>
            <p>{show.item.name}</p>
            
        </div>
        <div className='flex items-center justify-center flex-col h-screen'>
            <iframe 
            src={`https://vidsrc.to/embed/tv/${show.item.id}`} 
            allowFullScreen
            width="600" 
            height="350" 
            >
            </iframe>
        </div>
    </div>
  )
}

export default WatchShow