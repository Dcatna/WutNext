import React, { useEffect, useMemo, useState, useRef, ButtonHTMLAttributes } from 'react'
import genreData from './genres.json'
import { useAutoAnimate } from "@formkit/auto-animate/react";
import "./MovieBoxScroll.css"
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { title } from 'process';
import { resolve } from 'path';
import Moviebox, { Result } from '../Moviebox';

const itemsIndex = (items : Result[], currItem : Result) =>{
    for(let i = 0; i<items.length; i++) {
        if(items[i].title === currItem.title){
            return i
        }
    }
    return -1
}
interface Genre {
    id: number;
    name: string;
  }
interface FetchMoviesParams {
    pageParam: number;
  }
const MovieboxScroll = () => {
    //const [item, setItems] = useState<Result[]> = (])
    const ref = useRef();
    const [animationParent] = useAutoAnimate()
    const [appliedFilters, setAppliedFilters] = useState<number[]>([])
    const genres : Genre[] = genreData.genres as Genre[]
    const [arr, setArr] = useState<Result[]>()
    //const [page, setPage] = useState(1);
    const getGenreIds = () => [

    ]
    const fetchMovies = async ({pageParam} : FetchMoviesParams) => {
        const apiKey = '11e1be5dc8a3cf947ce265da83199bce';
        
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${pageParam}`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json()
    }

    // const getIDS = () => {
    //     return appliedFilters.map((genreName) => {
    //         const genreIds = genres.map((n) => n.name === genreName)
    //         return genreIds
    //     })
    // }

    const handleFilterButtons = (filter : number) => {
        setAppliedFilters((prevFilters : number[]) =>{
            if(prevFilters.includes(filter)){
                return prevFilters.filter(f => f !== filter)
            }
            else {
                // Add the filter to the array
                return [...prevFilters, filter];
            }
        })
    }

    const {data, fetchNextPage, isFetchingNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['trendingMovies'],
        
        queryFn: fetchMovies,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.total_pages) {
                return lastPage.page + 1; // Return the next page number
            } else {
                return undefined; // No more pages left
            }
        },
      });
      
    useEffect(() => {
        const handleScroll = () => {
            //checking if we are near the bottom of the screen
            if(window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
                fetchNextPage()
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    
    const items = useMemo(() => {
        return data?.pages.flatMap((page) =>{
            return page.results as Result[]
        })??[]    //returns empty list if data is null ??[]
    }, [data])
   // console.log(items)

    useEffect(() => {
        // Filter movies based on selected genres
        if (appliedFilters.length > 0) {
          setArr(items.filter(movie =>
            movie.genre_ids?.some((genreId : number) => appliedFilters.includes(genreId))
          ))
          
        }
        else{
            setArr(items)
        }
      }, [data, appliedFilters])

      console.log(arr, 'hi')
  return (
    <div className='main-container-scroll'>
        <div className='filter-container'>
            <div style={{display:'flex'}}>
                <p>Genres</p>
                <button style={{marginLeft:'152px'}} >APPLY</button>
            </div>
                <button onClick={() => handleFilterButtons(28)} className='filter-button'>Action & Adventure</button>
                <button onClick={() => handleFilterButtons(16)} className='filter-button'>Animation</button>
                <button onClick={() => handleFilterButtons(35)} className='filter-button'>Comedy</button>
                <button onClick={() => handleFilterButtons(80)} className='filter-button'>Crime</button>
                <button onClick={() => handleFilterButtons(99)} className='filter-button'>Documentary</button>
                <button onClick={() => handleFilterButtons(18)} className='filter-button'>Drama</button>
                <button onClick={() => handleFilterButtons(10751)} className='filter-button'>Family</button>
                <button onClick={() => handleFilterButtons(9648)} className='filter-button'>Mystery</button>
                <button onClick={() => handleFilterButtons(10749)} className='filter-button'>Romance</button>
                <button onClick={() => handleFilterButtons(14)} className='filter-button'>Fantasy</button>
                <button onClick={() => handleFilterButtons(53)} className='filter-button'>Triller</button>
                <button onClick={() => handleFilterButtons(878)} className='filter-button'>Science Fiction</button>
                <button onClick={() => handleFilterButtons(10752)} className='filter-button'>War & Politics</button>
                <button onClick={() => handleFilterButtons(37)} className='filter-button'>Western</button>
            </div>
        <div className='scroll-container' >

                    {arr?.map((movie : Result) => (
                        <div className='scroll-item'>
                        <Moviebox key={movie.id} item={movie}></Moviebox>
                        </div>))}
        </div>
        <div>

        </div>
    </div>
  )
}

export default MovieboxScroll