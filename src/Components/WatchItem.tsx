import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { movieBoxProp } from './Moviebox'
type Props = {}

const WatchItem = (props: Props) => {
    const location = useLocation()
    const movie : movieBoxProp = location.state

  return (
    <div>
        <div className='items-center justify-center flex mt-10'>
            <p>{movie.item.title}</p>
            
        </div>
        <div className='flex items-center justify-center flex-col h-screen'>
            <iframe 
            src={`https://vidsrc.to/embed/movie/${movie.item.id}`} 
            allowFullScreen
            width="600" 
            height="350" 
            >
            </iframe>
        </div>
    </div>
  )
}

export default WatchItem