import React, { useContext, useEffect, useMemo, useState } from 'react'
import TMDBCClient from '../data/TMDBClient'
import { TMDBClientContext } from '../App'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MovieListResult, ShowListResult } from '../data/types/MovieListResponse'
import Moviebox from '../Components/Moviebox'
import Navbar from './Navbar/Navbar'
import { Skeleton } from '../Components/Skeleton'
import Showbox from '../Components/Showbox'
interface pageParm {
    pageParam : number
}
type Screen = "movie" | "tv"
type SearchResult = MovieListResult | ShowListResult;

const SearchPage = () => {
    const [currSearch, setCurrSearch] = useState<string>("")
    const [searchState, setSearchState] = useState<Screen>("movie")
    const [searching, setSearching] = useState<boolean>(false)
    const client = useContext(TMDBClientContext)
    
    const [query, setQuery] = useState<string>('')

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: [query, currSearch, searchState],
        queryFn: async ({pageParam}) => {
            if (currSearch !== "") {
                if(searchState == "movie") {
                    return client.fetchMovieSearchList(pageParam, searchState, currSearch)
                }
                else{
                    return client.fetchShowSearchList(pageParam, searchState, currSearch);
                }
                
            } else {
                return client.fetchMovieList(pageParam, searchState, []);
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.total_pages) {
                return lastPage.page + 1;
            } else {
                return undefined;
            }
        },
    })

    useEffect(() => {
        const handleScroll = () => {
            //checking if we are near the bottom of the screen
            if(window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
                fetchNextPage().catch((e) => alert(e.toLocaleString()))
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)

    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const items : SearchResult[] = useMemo(() => {
        console.log(currSearch)
        return data?.pages.flatMap((page) => page.results as SearchResult[]) ?? []

    }, [data, currSearch])


    React.useEffect(() => {
        setSearching(true)
        const delayInputTimeoutId = setTimeout(() => {
            setSearching(false);
        }, 500);
        return () => clearTimeout(delayInputTimeoutId);
    }, [currSearch, 500]);


  return (
    <body className='overflow-x-hidden'>
    <div className="flex flex-col items-center">
    <div className="my-4 w-full max-w-md mx-auto">
    <div className='flex justify-center items-center space-x-4 py-2 cursor-pointer'>
          <div onClick={() => setSearchState("movie")} className=''>Movies</div>
          <div> | </div>
          <div onClick={() => setSearchState("tv")}>Shows</div>
      </div>
        <input
            type="text"
            onChange={(letter) => setCurrSearch(letter.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-black"
            placeholder={searchState=="movie" ? "Search movies..." : "Search shows..."}
        />
    </div>
        <ItemsGrid items={items} searching={searching} />
        
</div>
</body>
  )
}

type ItemProps  = {
    items : SearchResult[]
    searching: boolean
}

const ItemsGrid = ({items,searching}: ItemProps) => {
    if (searching) {
        return  (
            <div className="w-full px-4 md:px-0">
                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 p-12">
                    {Array.from(Array(40).keys()).map((idx) => {
                        return (
                            <div className="flex flex-col space-y-3 p-6" key={idx}>
                                <Skeleton className="h-[300px] w-[220px] rounded-xl"/>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-9/12"/>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>
        )
    } else {
        return (
            <div className="w-full px-4 md:px-0 p-12">
                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 p-6">

                {items.map((item) => (
                        'original_title' in item ? (
                            <div key={item.id}>
                                <Moviebox item={item}></Moviebox>
                            </div>
                        ) : (

                            <div key={item.id}>
                                <Showbox item={item}></Showbox>
                            </div>
                        )
                    ))}
                </div>
            </div>
        )
    }
}

export default SearchPage
