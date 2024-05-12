import React, { useContext, useEffect, useMemo, useState } from 'react'
import { MovieDetails, ShowDetails } from '../data/types/types'
import { MovieListResult, ShowListResult } from '../data/types/MovieListResponse'
import { supabase } from '../lib/supabaseClient'
import { CurrentUserContext } from '../App'
import { Link, useNavigate } from 'react-router-dom'
import { PosterLists, UserList } from './Home'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBorderAll,faGripLines, faPlus, faGripLinesVertical} from '@fortawesome/free-solid-svg-icons'
import Popup from './Popup'
import Lists from './Lists'
import defaultList from "./default_favorite_list.jpg"
import Moviebox from '../Components/Moviebox'
import Showbox from '../Components/Showbox'
import {useQuery} from "@tanstack/react-query";
import {selectListsWithPosters} from "../data/userlists";
type Props = {}

const Favorites = (props: Props) => {
    const client = useContext(CurrentUserContext)
    const [movies, setMovies] = useState<MovieListResult[]>([])
    const [shows, setShows] = useState<ShowListResult[]>([])
    const [favoriteID, setFavoriteID] = useState<[number,number]>()
    const [refresh, setRefresh] = useState(0)

    const listQuery = useQuery({
        queryKey: ['user_lists', client?.user.id],
        queryFn: async () => {
            return await selectListsWithPosters(client?.user.id)
        },
    })

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
        fetchMoviesShowsFromList().catch(e => console.log(e))
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
        setMovies(movies => [...movies, movieResult]);
        
      }
      async function fetchShowByID(show_id: number) {
        const apiKey: string = '11e1be5dc8a3cf947ce265da83199bce';
        console.log(show_id)
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

   const handleDeleteMovies = (deletedMovieId : number) => {
        // Update movies array by filtering out the deleted movie
        setMovies(currentMovies => currentMovies.filter(movie => movie.id !== deletedMovieId));
    }

    const handleDeleteShows = (deletedShowId : number) => {
        // Update movies array by filtering out the deleted movie
        setShows(currentShows => currentShows.filter(show => show.id !== deletedShowId));
    }

  return (
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
                    <Moviebox key={movie.id} item={movie} inList={true} lst={undefined} onDelete={handleDeleteMovies}></Moviebox>
                ))}
                {shows.map((show: ShowListResult, index: number) => (
                    <Showbox key={show.id} item={show}  inList={true} lst={undefined} onDelete={handleDeleteShows}></Showbox>
                ))}
        </div>
    </div>
  )
}

export default Favorites