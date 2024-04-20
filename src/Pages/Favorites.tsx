import React, { useContext, useEffect, useMemo, useState } from 'react'
import { MovieDetails, ShowDetails } from '../data/types/types'
import { MovieListResult, ShowListResult } from '../data/types/MovieListResponse'
import { supabase } from '../lib/supabaseClient'
import { CurrentUserContext } from '../App'
import { Link, useNavigate } from 'react-router-dom'
import { PosterLists, UserList } from './Browse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBorderAll,faGripLines, faPlus, faGripLinesVertical} from '@fortawesome/free-solid-svg-icons'
import Popup from './Popup'
import Lists from './Lists'
import defaultList from "./default_favorite_list.jpg"
import Moviebox from '../Components/Moviebox'
import Showbox from '../Components/Showbox'
type Props = {}

const Favorites = (props: Props) => {
    const client = useContext(CurrentUserContext)
    const [movies, setMovies] = useState<MovieListResult[]>([])
    const [shows, setShows] = useState<ShowListResult[]>([])
    const [userLists, setUserLists] = useState<UserList[]>()
    const [posterPaths, setPosterPaths] = useState<PosterLists[]>()
    const [refresh, setRefresh] = useState(0)
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [loadingShows, setLoadingShows] = useState(true);
    const [loadingPicutes, setLoadingPictures] = useState(true)
    async function fetchMoviesShowsFromList(){
        const {data, error } = await supabase.from("favoritemovies").select("*").eq("user_id", client?.user.id)
        if(error) {
            console.log(error)
        }else{
            data.forEach(item => {
                if (item.movie_id !== -1) {
                    fetchMovieByID(item.movie_id);
                } else if (item.show_id !== -1) {
                    fetchShowByID(item.show_id);
                }
            })
        }
    }
    useEffect(() => {
        fetchMoviesShowsFromList()
    }, [client?.access_token])
    async function fetchMovieByID(movie_id: number) {
        const apiKey: string = '11e1be5dc8a3cf947ce265da83199bce';
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${apiKey}`);
        const movieDetails: MovieDetails = await res.json();
    
        // Convert and add to items state.
        const movieResult: MovieListResult = {
          ...movieDetails,
          media_type: 'movie', // Assuming the type.
          genre_ids: movieDetails.genres.map(genre => genre.id), // Convert genres to IDs.
        };
        setLoadingMovies(false)
        setMovies(movies => [...movies, movieResult]);
        
      }
      async function fetchShowByID(show_id: number) {
        const apiKey: string = '11e1be5dc8a3cf947ce265da83199bce';
        const res = await fetch(`https://api.themoviedb.org/3/tv/${show_id}?api_key=${apiKey}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const showDetails: ShowDetails = await res.json();
        
        // Convert ShowDetails to ShowListResult
        const showResult: ShowListResult = {
            adult: showDetails.adult,
            backdrop_path: showDetails.backdrop_path,
            genre_ids: showDetails.genres.map(genre => genre.id),
            id: showDetails.id,
            origin_country: showDetails.origin_country,
            original_language: showDetails.original_language,
            original_name: showDetails.original_name,
            overview: showDetails.overview,
            popularity: showDetails.popularity,
            poster_path: showDetails.poster_path,
            first_air_date: showDetails.first_air_date,
            name: showDetails.name,
            vote_average: showDetails.vote_average,
            vote_count: showDetails.vote_count,
        };
        setLoadingShows(false)
        setShows(shows => [...shows, showResult]);
        
    }
    useEffect(() => {

        async function getLists(){
            const {data, error} = await supabase.from("userlist").select("*").eq("user_id", client?.user.id)
            console.log(data, "lsits")
            if(error){
                console.log(error)
            }
            else{
                setUserLists(data as UserList[])
            }
        }
        async function getListPictures() {
            const {data, error} = await supabase.rpc("select_lists_with_poster_items_for_user_id", { uid: client?.user.id,  lim: 9999, off: 0})
            if(error) {
                console.log(error)
            }
            else {
                const res = data as PosterLists[]
                setPosterPaths(res)
                setLoadingPictures(false)
            }
        }

        getLists()
        getListPictures()
        
    }, [client, refresh])

  return (
    <div className='flex mt-5'>
    <div className='w-1/4 sticky top-0 h-screen overflow-y-auto bg-custom-bluegray'>
        <div>
            <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                    <FontAwesomeIcon className='mt-1 size-6' icon={faGripLinesVertical} />
                    <p className='ml-1 text-lg'>Your Library</p>
                </div>
                <div  className='mt-1 hover:bg-slate-800'>
                    <Popup></Popup>
                </div>
            </div>
        </div>
        <Link to="/favorites">
        <div className='w-full rounded-md hover:bg-black/50 text-center flex flex-relative p-1 mt-1'> 
            
                <div className='w-[65px] grid grid-cols rounded-lg overflow-hidden'>
                    <img src={defaultList} alt="" className='w-full h-full object-cover aspect-1'/>
                </div>
                <div className='flex items-center ml-2'>
                    <div className='flex flex-col '>
                        <p className='text-left'>Favorites </p>
                        <p className='text-left'>Created By: {client?.user.email?.slice(0, client?.user.email?.indexOf("@"))}</p>
                    </div> 
                </div>
            
            </div>
            </Link>
        <div className=''>
            {posterPaths?.map((lst: PosterLists, index: number) => (
                <Lists key={index} item={lst}></Lists> 
            ))}
        </div>
    </div>
    <div className='w-3/4 flex flex-col ml-16 mb-8' >
        <div className='flex justify-between items-start mb-4 w-full'>
            <div className='flex space-x-4'>
                <div className='w-[180px] rounded-lg overflow-hidden'>
                    <img src={defaultList} className='w-full h-full object-cover aspect-1'></img>
                </div>
                <div>
                    <p className='text-6xl'>Favorites</p>
                    <p>{client?.user.email?.slice(0, client?.user.email?.indexOf("@"))} - {movies.length + shows.length} Items</p>
                    
                </div>
            </div>
        </div>
        <div className='grid lg:grid-cols-5 sm:grid-cols-2 md:grid-cols-4 gap-4 mr-4'>
                {movies.map((movie: MovieListResult, index: number) => (
                    <Moviebox key={index} item={movie}></Moviebox>
                ))}
                {shows.map((show: ShowListResult, index: number) => (
                    <Showbox key={index} item={show}></Showbox>
                ))}
        </div>
    </div>
    </div>
  )
}

export default Favorites