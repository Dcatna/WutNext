import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { movieBoxProp } from './Moviebox'
import { TMDBClientContext } from '../App'
import { MovieTrailer } from '../data/types/MovieListResponse'


const MovieInfo = () => {

    const location = useLocation()
    const movie : movieBoxProp = location.state
    const client = useContext(TMDBClientContext)
    const [videoData, setVideoData] = useState<MovieTrailer>()
    async function fetchMovieTrailer() {
        const video_response: Promise<MovieTrailer> = client.fetchTrailer(movie.item.id); // Assume this function returns a Promise<MovieTrailer>
        const trailer: MovieTrailer = await video_response;
        
        setVideoData(trailer)
    }

    useEffect(() => {
        fetchMovieTrailer()
    }, [])


  return (
    <div>
        <VideoComponent videoKey={videoData?.results[0].key}></VideoComponent>
        <p>{movie.item.title}</p>
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