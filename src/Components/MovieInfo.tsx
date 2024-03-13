import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { movieBoxProp } from './Moviebox'
import { TMDBClientContext } from '../App'
import { MovieTrailer } from '../data/types/MovieListResponse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBorderAll,faGripLines, faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import Navbar from '../Pages/Navbar/Navbar'
import { Cast, Credit } from '../data/types/types'
import ActorBox from './ActorBox'

const partial_url = "https://image.tmdb.org/t/p/original/"

const MovieInfo = () => {

    const location = useLocation()
    const movie : movieBoxProp = location.state
    const client = useContext(TMDBClientContext)
    const [videoData, setVideoData] = useState<MovieTrailer>()
    const [actors, setActors] = useState<Cast[]>()

    async function fetchMovieTrailer() {
        const video_response: Promise<MovieTrailer> = client.fetchTrailer(movie.item.id);
        
        const trailer: MovieTrailer = await video_response
        
        setVideoData(trailer)
    }   
    async function fetchCredits() {
      const cred : Promise<Credit> = client.fetchCreditList(movie.item.id)
      const credits : Credit = await cred
      setActors(credits.cast)
    }
    useEffect(() => {
        fetchMovieTrailer()
        fetchCredits()
    }, [])


  return (
    <div className='overflow-x-hidden'>
        <Navbar></Navbar>
    <div className="flex items-center justify-between">

    </div>
    <div className='relative mt-10 ml-10 flex' style={{ height: '500px' }}>
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.item.poster_path})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        <div className='z-20 flex items-center p-10'>
          <img className="h-96 w-auto object-cover" src={partial_url + movie.item.poster_path} alt="" />
          <div className='ml-10 text-white'>
            <p className="text-2xl">{movie.item.title}</p>
            <p className='mt-5'>{movie.item.vote_average}</p>
            <p className='mt-5'>Overview</p>
            <p >{movie.item.overview}</p>
          </div>
        </div>
    </div>

      <div>

      </div>
      <div className='mt-10 ml-10'>
        
        <VideoComponent videoKey={videoData?.results[0]?.key}></VideoComponent>
        <div className='flex overflow-x-auto ' style={{width: '1000px', marginLeft:'100px'}}>{actors?.map((actor) => (
          <ActorBox actor={actor}></ActorBox>
        ))}</div>
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

export default MovieInfo