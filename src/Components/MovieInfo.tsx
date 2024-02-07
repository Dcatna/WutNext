import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { movieBoxProp } from './Moviebox'
import { TMDBClientContext } from '../App'
import { MovieTrailer } from '../data/types/MovieListResponse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBorderAll,faGripLines, faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import Navbar from '../Pages/Navbar/Navbar'


const MovieInfo = () => {

    const location = useLocation()
    const movie : movieBoxProp = location.state
    const client = useContext(TMDBClientContext)
    const [videoData, setVideoData] = useState<MovieTrailer>()

    async function fetchMovieTrailer() {
        const video_response: Promise<MovieTrailer> = client.fetchTrailer(movie.item.id);
        const trailer: MovieTrailer = await video_response;
        
        setVideoData(trailer)
    }

    useEffect(() => {
        fetchMovieTrailer()
    }, [])


  return (
    <div className=''>
        <Navbar></Navbar>
    <div className="flex items-center justify-between">

        <div className="flex-1 relative">
            <p className="absolute left-1/2 transform -translate-x-1/2">{movie.item.title}</p>
        </div>
    </div>
        <div className='h-screen flex items-center justify-center'>
            <VideoComponent videoKey={videoData?.results[0].key}></VideoComponent>
            
        </div>
    </div>
  )
}
interface video {
    videoKey : string | undefined
}
function VideoComponent({videoKey} : video) {
    const embedUrl = `https://www.youtube.com/embed/${videoKey}`;
  
    return (
      <iframe 
        width="560" 
        height="315" 
        src={embedUrl} 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen>
      </iframe>
    );
  }
  
  // Usage example:
  // <VideoComponent videoKey="QUCzcEz4FKw" />
  
export default MovieInfo