import React, { useContext, useEffect, useMemo, useState } from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import { PosterLists, UserList } from './Home'
import { supabase } from '../lib/supabaseClient'
import { MovieListResponse, MovieListResult, ShowListResult } from '../data/types/MovieListResponse'
import { MovieDetails, ShowDetails } from '../data/types/types'
import Moviebox from '../Components/Moviebox'
import Showbox from '../Components/Showbox'
import { Button } from '../Components/Button'
import { CurrentUserContext } from '../App'
import movieicon from "./movieicon.png"
import { Divide, Filter } from 'lucide-react'
import Popup from './Popup'
import Lists from './Lists'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faGripLinesVertical} from '@fortawesome/free-solid-svg-icons'
import defaultList from "./default_favorite_list.jpg"
import {getListsByUserId} from "../data/userlists";
import userPreferences from "../Components/ProfileNav/UserPreferences";
type Props = {}
interface ListTypes{
    list_id : string,
    movie_id : number,
    show_id : number,
    user_id : string,
    poster_path : string
}

const ListItems = (props: Props) => {
    const params = useParams()

    const listId = params['listId']
    const location = useLocation()
    const lst : UserList = location.state
    const client = useContext(CurrentUserContext)
    const nav = useNavigate()

    const [movies, setMovies] = useState<MovieListResult[]>([])
    const [shows, setShows] = useState<ShowListResult[]>([])
    const [userLists, setUserLists] = useState<UserList[]>()
    const [posterPaths, setPosterPaths] = useState<PosterLists[]>()
    const [refresh, setRefresh] = useState(0)
    const [singlePosterPath, setSinglePosterPath] = useState<PosterLists>()

    async function fetchMoviesShowsFromList(){
        const {data, error } = await supabase
            .from("listitem"
            ).select("*")
            .eq("list_id", listId)
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
        setMovies([])
        setShows([])
        fetchMoviesShowsFromList()
    }, [listId])
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
        setShows(shows => [...shows, showResult]);
        
    }

    useEffect(() => {

        async function getLists(){
            const data = await getListsByUserId(client?.user.id)

            setUserLists(data)
        }

        getLists().catch(e => console.log(e))
    }, [client, refresh, listId, movies, shows])

    useEffect(() => {
        async function getListPictures() {
            const {data, error} = await supabase.rpc("select_lists_with_poster_items_for_user_id", { uid: client?.user.id,  lim: 9999, off: 0})
            if(error) {
                console.log(error, "ERORR")
            }
            else {
                const res = data as PosterLists[]
                const foundElement = res.find(ll => ll.list_id === listId)
                setSinglePosterPath(foundElement)
            }
        }
        getListPictures().catch()
    }, [client?.access_token, listId, movies, shows])

        const posters = useMemo<string[]>(() => {
            if(!singlePosterPath?.ids){
                return []
            }
            if(singlePosterPath?.ids.length < 4){
                   const posterData = singlePosterPath?.ids!![0].split(",")
                   return [posterData[2]]
            }
            
            else{
                return (singlePosterPath?.ids?.map(poster => {
                    const posterData = poster.split(",")
                    return posterData[2]
                }) ?? []) 
            }
        }, [singlePosterPath?.ids, listId])
    
    async function deleteList() {
        const {data, error} = await supabase.from("userlist").delete().match({"list_id" : listId})
        if(error) {
            console.log(error)
        }
        nav("/")
        
    }
    const handleDeleteMovies = (deletedMovieId : number) => {
        // Update movies array by filtering out the deleted movie
        setMovies(currentMovies => currentMovies.filter(movie => movie.id !== deletedMovieId));
    }
    const handleDeleteShows = (deletedShowId : number) => {
        // Update movies array by filtering out the deleted movie
        setShows(currentShows => currentShows.filter(show => show.id !== deletedShowId));
    }
  return (
    <div className='w-3/4 flex flex-col ml-16 mb-8'>
        <div className='flex justify-between items-start mb-4 w-full'>
            <div className='flex space-x-4'>
                <div className='w-[180px] rounded-lg overflow-hidden'>
                {posters.length == 1 ? 
                    <div className='w-[180px] grid grid-cols rounded-lg overflow-hidden'>
                        <img src={`https://image.tmdb.org/t/p/original//${posters[0]}`} alt="" className='w-full h-full object-cover aspect-1'/>
                    </div>
                     : posters.length > 1 ?
                    
                <div className='grid grid-cols-2 w-[180px] rounded-lg overflow-hidden'>
                {posters.map((post) => (
                     <div className='w-full relative'>
                        <img src={`https://image.tmdb.org/t/p/original//${post}`} alt="" className='w-full h-full object-cover aspect-1'/>
                    </div>
                ))} </div>: <div className='w-[180px] grid grid-cols rounded-lg overflow-hidden'><img src={movieicon} className='w-full h-full object-cover aspect-1'></img></div>}
                </div>
                <div>
                    <p className='text-6xl'>{lst.name}</p>
                    <p>{singlePosterPath?.username} - {movies.length + shows.length} items</p>
                    <p>{lst.subscribers}</p>
                </div>
            </div>
            <Button onClick={deleteList} className='self-start'>Delete List</Button>
        </div>
        

        <div className='grid lg:grid-cols-5 sm:grid-cols-3 md:grid-cols-4 gap-4 mr-4'>
            {movies.map((movie: MovieListResult, index: number) => (
                <Moviebox key={movie.id} item={movie} inList = {true} lst={lst} onDelete={handleDeleteMovies}></Moviebox>
            ))}
            {shows.map((show: ShowListResult, index: number) => (
                <Showbox key={show.id} item={show} inList={true} lst={lst} onDelete={handleDeleteShows}></Showbox>
            ))}
        </div>
    </div>
  )
}


export default ListItems