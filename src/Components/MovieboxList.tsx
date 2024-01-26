import React, { useEffect, useMemo, useState } from 'react'
import Moviebox, { Result, Root } from './Moviebox'
import { useAutoAnimate } from "@formkit/auto-animate/react";
import "./MovieboxList.css"
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { title } from 'process';
import { resolve } from 'path';
interface movieBoxListProp{
    items: Result[]
}

const itemsIndex = (items : Result[], currItem : Result) =>{
    for(let i = 0; i<items.length; i++) {
        if(items[i].title === currItem.title){
            return i
        }
    }
    return -1
}

interface Movie {
    id: number;
    title: string;
    // Add other movie properties as needed
  }
  
  interface MoviesApiResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    // Add other response properties as needed
  }
  
  async function fetchTrendingMovies({ pageParam = 0 }): Promise<MoviesApiResponse> {
    const apiKey = '11e1be5dc8a3cf947ce265da83199bce';
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${pageParam}`);
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json()
   
}
interface FetchMoviesParams {
    pageParam: number;
  }
const Movieboxlist = () => {
    //const [item, setItems] = useState<Result[]> = (])
    
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
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
      } = useInfiniteQuery({
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
    
    const items = useMemo(() => {
        return data?.pages.flatMap((page) =>{
            return page.results as Result[]
        })??[]    //returns empty list if data is null ??[]
    }, [data])
    console.log(items)

    const [arr, setArr] = useState<Result[]>([])

    useEffect(() =>{
        if(arr.length === 0){
            setArr(items.slice(0, 3))
        }
    }, [items])


    //if (isFetching && isFetchingNextPage) return <span>Loading...</span>;

    
    console.log(arr)
    const onLeftButtonClick = () => {
        const leftMost = itemsIndex(items, arr[0])
        if (leftMost !== -1 && items[leftMost - 1]) {
            setArr((prev) => [items[leftMost - 1], prev[0], prev[1]])
        }
    }

    const onRightButtonClick = () => {
        const last = itemsIndex(items, arr[2])
        if(items[last+2] === undefined){
            fetchNextPage()
        }
        console.log(last !== -1)
        if (last !== -1 ) {
            if(items[last + 1]){
                setArr((prev) => [prev[1], prev[2], items[last + 1]])
            }
            else if(items[last+3] === undefined){
                //call pager function
                console.log('hieello', data)
                //fetchNextPage()
                console.log('after', data)
            }
        }
  
    }

  return (
    <div style={{
        display: "inline-flex",
        alignItems: "stretch",
        width: "max-content",
        backgroundColor: "#404040",
        paddingBottom: "15px",
    }}>
        <ul ref={animationParent} style={{ display: "flex", padding: 0, listStyle: "none",}}>
            <button onClick={()=>{onLeftButtonClick()}} style={{
                
            }}>
                LEFT
            </button>
        {arr.map((item: Result) => (
            <li key={item.id} style={{
                margin:'60px'
            }}>
                    <Moviebox item = {item}/>
                </li>
                ))}
            <button onClick={() => {onRightButtonClick()}} style={{
                marginLeft:'60px'
            }}>RIGHT</button>
        </ul>
    </div>
  )
}

export default Movieboxlist