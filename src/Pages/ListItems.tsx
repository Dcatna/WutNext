import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { userLists } from './Browse'
import { supabase } from '../lib/supabaseClient'
import { MovieListResponse, MovieListResult, ShowListResult } from '../data/types/MovieListResponse'
import { MovieDetails, ShowDetails } from '../data/types/types'
import Moviebox from '../Components/Moviebox'
import Showbox from '../Components/Showbox'
type Props = {}
interface ListTypes{
    list_id : string,
    movie_id : number,
    show_id : number,
    user_id : string
}

const ListItems = (props: Props) => {
    const location = useLocation()
    const lst : userLists = location.state
    const [movieShows, setMovieShows] = useState<ListTypes[]>([])
    const [movies, setMovies] = useState<MovieListResult[]>([])
    const [shows, setShows] = useState<ShowListResult[]>([])
    async function fetchMoviesShowsFromList(){
        const {data, error } = await supabase.from("listitem").select("*").eq("list_id", lst.list_id)
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
    
        // Add the converted show to your state
        setShows(shows => [...shows, showResult]);
    }
    useEffect(() => {
        fetchMoviesShowsFromList()
    }, [])
    console.log(movies)
  return (
    
    <div>
        <div className='items-center justify-center flex'>
            {lst.name}
            {lst.list_id}
        </div>
        <div className='w-full grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {movies.map((movie : MovieListResult) => (
                <div className='w-[200px]'>
                    <Moviebox item={movie}></Moviebox>
                </div>
            ))}
            {shows.map((show : ShowListResult) => (
                <div className='w-[200px]'>
                    <Showbox item={show}></Showbox>
                </div>
            ))}
        </div>
        
        
    </div>
  )
}


export default ListItems