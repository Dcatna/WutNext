import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import Moviebox, { movieBoxProp } from '../Components/Moviebox'
import { MovieListResponse, MovieListResult, MovieListType, ShowListResponse, ShowListType } from '../data/types/MovieListResponse'
import { Link } from 'react-router-dom'

const itemsIndex = (items : MovieListResult[], currItem : MovieListResult) =>{
    for(let i = 0; i<items.length; i++) {
        if(items[i].title === currItem.title){
            return i
        }
    }
    return -1
}
interface HoriScrollType {
    movieType : MovieListType | undefined,
    showType : ShowListType | undefined,
    movieOrShow : movieShow
}
type movieShow = "movie" | "tv"

interface FetchMoviesParams {
    pageParam: number;
  }
const HorizontalMovieScroll = ({movieType, showType, movieOrShow} : HoriScrollType) => {
   //const [item, setItems] = useState<Result[]> = (])

   //const [animationParent] = useAutoAnimate()
   const [arr, setArr] = useState<MovieListResult[]>([])
   //const [page, setPage] = useState(1);

   async function fetchMovies(){
       const apiKey = '11e1be5dc8a3cf947ce265da83199bce';
       
       const res = await fetch(`https://api.themoviedb.org/3/${movieOrShow}/${movieType ? movieType : showType}?api_key=${apiKey}&page=1`)
       if (!res.ok) {
         throw new Error('Network response was not ok');
       }else{
        const movies : MovieListResponse = await res.json()
        console.log(movies)
        setArr(movies.results)
       }
       
   }

   useEffect(() => {
    fetchMovies()
   }, [])

 return (
   <div className='flex flex-row w-full overflow-x-auto'> 
       {arr.map((item: MovieListResult) => (
        <div className='min-w-[200px] px-2'>
            <MovieItems item = {item}/>
         </div>
         ))}
           
   </div>
 )
}
const MovieItems = ({item} : movieBoxProp) => {
    const partial_url = "https://image.tmdb.org/t/p/original/";
    const [loaded, setLoaded] = useState(false);

    return (
        <Link to={'/info'} state={{ item }} className="block w-full relative m-2 aspect-[3/4]">
            <img
                onLoad={() => setLoaded(true)}
                className="absolute top-0 left-0 w-full h-full rounded-md object-cover "
                src={`${partial_url}${item.poster_path}`}
                alt="Movie Poster"
            />
            <div className="absolute bottom-0 left-0 w-full h-4/6 bg-gradient-to-t from-black to-transparent rounded-md"/>
            <div className="absolute bottom-0 left-0 w-full h-full hover:bg-gradient-to-t from-slate-900 to-transparent bg-transparent rounded-md"/>
            {loaded && (
                <text className="absolute bottom-0 left-0 m-2 text-white text-xs line-clamp-2">
                    {item.title}
                </text>
            )}
        </Link>
    )
}



export default HorizontalMovieScroll