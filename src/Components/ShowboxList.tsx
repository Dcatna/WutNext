import React, { useEffect, useMemo, useState } from 'react'

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Showbox  from './Showbox';
import {MovieListResult, ShowListResponse, ShowListResult} from "../data/types/MovieListResponse";
interface movieBoxListProp{
    items: MovieListResult[]
}

const itemsIndex = (items : ShowListResult[], currItem : ShowListResult) =>{
    for(let i = 0; i<items.length; i++) {
        if(items[i].name === currItem.name){
            return i
        }
    }
    return -1
}

interface FetchMoviesParams {
    pageParam: number;
  }
const Showboxlist = () => {
    //const [item, setItems] = useState<Result[]> = (])
    
    const [animationParent] = useAutoAnimate()
  
    //const [page, setPage] = useState(1);

    const fetchMovies = async ({pageParam} : FetchMoviesParams) => {
        const apiKey = '11e1be5dc8a3cf947ce265da83199bce';
        const res = await fetch(`https://api.themoviedb.org/3/popular/tv/week?api_key=${apiKey}&page=${pageParam}`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json()
    }
    const {data, fetchNextPage} = useInfiniteQuery({
        queryKey: ['trendingTv'],
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
        })??[]    //returns empty list if data is null ??[]
    }, [data])
    console.log(items)

    const [arr, setArr] = useState<ShowListResult[]>([])

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
        if(items[last+2] === undefined){
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
        {arr.map((item: ShowListResult) => (
            <li key={item.id} style={{
                margin:'5px'
            }}>
                    <Showbox item = {item} inList={false} lst={undefined}/>
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

export default Showboxlist