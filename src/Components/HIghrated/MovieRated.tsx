import React, { useEffect, useMemo, useState } from 'react'
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import MovieRatedBox from './MovieRatedBox';
import {MovieListResult} from "../../data/types/MovieListResponse";

const itemsIndex = (items : MovieListResult[], currItem : MovieListResult) =>{
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


const MovieRated = () => {
    const [animationParent] = useAutoAnimate()
  
    //const [page, setPage] = useState(1);

    const fetchMovies = async ({pageParam} : FetchMoviesParams) => {
        const apiKey = '11e1be5dc8a3cf947ce265da83199bce';
        const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=${pageParam}`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json()
    }
    const {data, fetchNextPage} = useInfiniteQuery({
        queryKey: ['topRated'],
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
    
    const items = useMemo(() => {
        return data?.pages.flatMap((page) =>{
            return page.results
        }) ?? []    //returns empty list if data is null ??[]
    }, [data])

    const [arr, setArr] = useState<MovieListResult[]>([])

    useEffect(() =>{
        if(arr.length === 0){
            setArr(items.slice(0, 8))
        }
    }, [items])

    //if (isFetching && isFetchingNextPage) return <span>Loading...</span>;    
    console.log(arr)
    const onLeftButtonClick = () => {
        const leftMost = itemsIndex(items, arr[0])
        if (leftMost !== -1 && items[leftMost - 1]) {
            setArr((prev) => [items[leftMost - 1], prev[0], prev[1], prev[2], prev[3], prev[4], prev[5], prev[6]])
        }
    }

    const onRightButtonClick = () => {
        const last = itemsIndex(items, arr[7])
        if(items[last+2] === undefined) {
            fetchNextPage()
        }
        //console.log(last !== -1)
        if (last !== -1 ) {
            if(items[last + 1]){
                setArr((prev) => [prev[1], prev[2], prev[3], prev[4], prev[5], prev[6], prev[7], items[last + 1]])
            }
        }
  
    }

  return (
    <div className='main-container'>
        <ul ref={animationParent} style={{ display: "flex", padding: 0, listStyle: "none",}}>
            <button className='slider-button-left' onClick={()=>{onLeftButtonClick()}} style={{
                
            }}>
                LEFT
            </button>
        {arr.map((item: MovieListResult) => (
            <li key={item.id} style={{
                margin:'5px'
            }}>
                    <MovieRatedBox item = {item}/>
                </li>
                ))}
            <button className='slider-button-right' onClick={() => {onRightButtonClick()}} style={{
                marginLeft:'50px',
                width:'100%'
            }}>RIGHT</button>
        </ul>
    </div>
  )
}

export default MovieRated