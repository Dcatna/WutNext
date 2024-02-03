import React, { useEffect, useMemo, useState, useRef } from 'react'

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

interface FetchMoviesParams {
    pageParam: number;
  }
const MovieboxScroll = () => {
    //const [item, setItems] = useState<Result[]> = (])
    const ref = useRef();
    const [animationParent] = useAutoAnimate()
    
    //const [page, setPage] = useState(1);

    const fetchMovies = async ({pageParam} : FetchMoviesParams) => {
        const apiKey = '11e1be5dc8a3cf947ce265da83199bce';
        
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${pageParam}`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json()
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
            if(window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
                fetchNextPage()
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])
    

  return (
    <div className='main-container-scroll'>
        <div className='main-scroll'>
        <div className='scroll-container' >
            {data?.pages.map((page, index) => (
                <React.Fragment key={index}>
                    {page.results.map((movie : Result) => (
                        <div className='scroll-item'>
                        <Moviebox key={movie.id} item={movie}></Moviebox>
                        </div>
                    ))}
                </React.Fragment>
            ))}
        </div>
            <div>
                <button onClick={() => fetchNextPage()}>
                    LOAD NEXT PAGE!
                </button>
            </div>
        </div>

    </div>
  )
}

export default MovieboxScroll