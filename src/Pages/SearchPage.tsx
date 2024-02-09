import React, { useContext, useEffect, useMemo, useState } from 'react'
import TMDBCClient from '../data/TMDBClient'
import { TMDBClientContext } from '../App'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MovieListResult } from '../data/types/MovieListResponse'
import Moviebox from '../Components/Moviebox'
import Navbar from './Navbar/Navbar'

const SearchPage = () => {
    const [currSearch, setCurrSearch] = useState<string>("")
    const client = useContext(TMDBClientContext)
    
    const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['trendingMovies', currSearch],
        queryFn: async ({pageParam}) => {
            if (currSearch !== "") {
                return client.fetchSearchList(pageParam, "movie", currSearch);
            } else {
                return client.fetchMovieList(pageParam, "movie", []);
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
    });

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

    const items = useMemo(() => {
        console.log(currSearch)
        return data?.pages.flatMap((page) => page.results) ?? []

    }, [data, currSearch])


  return (
    <body className='overflow-x-hidden'>
    <div className="flex flex-col items-center">
    <Navbar></Navbar>
    <div className="my-4 w-full max-w-md mx-auto">
        <input type="text" onChange={(letter) => setCurrSearch(letter.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-black" placeholder="Search movies..."/>
    </div>


    <div className="w-full px-4 md:px-0">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
            {items.map((item: MovieListResult) => (
                <div key={item.id ? item.id : 1}>
                    <Moviebox item={item}></Moviebox>
                </div>
            ))}
        </div>
    </div>
</div>
</body>
  )
}

export default SearchPage