import React, {useContext, useEffect, useMemo, useState} from 'react'
import genreData from './genres.json'
import ratingData from './ratings.json'
import {QueryFunctionContext, useInfiniteQuery} from '@tanstack/react-query';
import Moviebox from '../Moviebox';
import {Badge} from "../Badge";
import {Card} from "../Card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../Select";
import {MovieListResult} from "../../data/types/MovieListResponse";
import {TMDBClientContext} from "../../App";
import {Genre, Rating} from "../../data/types/types";

const itemsIndex = (items : MovieListResult[], currItem : MovieListResult) =>{
    for(let i = 0; i<items.length; i++) {
        if(items[i].title === currItem.title){
            return i
        }
    }
    return -1
}


const MovieboxScroll = () => {

    const [appliedFilters, setAppliedFilters] = useState<number[]>([])

    const client = useContext(TMDBClientContext)

    const handleFilterButtons = (filter : number) => {
        setAppliedFilters((prevFilters : number[]) =>
            prevFilters.includes(filter)
                ? prevFilters.filter((it) => it != filter)
                : [...prevFilters, filter]
        )
    }

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['trendingMovies'],
        queryFn: ({ pageParam  }) => client.fetchMovieList(pageParam, "popular"),
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
                fetchNextPage().catch((e) => alert(e.toLocaleString()))
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)

    }, [hasNextPage, isFetchingNextPage, fetchNextPage])


    const items = useMemo(() => {

        const res = data?.pages.flatMap((page) => page.results) ?? []

        return appliedFilters.length < 1 ? res : res.filter((it: MovieListResult) => {
            return !it.genre_ids.every((it) => !appliedFilters.includes(it))
        })

    }, [data, appliedFilters])

    return (
        <div className="flex flex-row h-full w-full">
            <div className="w-1/4">
               <FilterSideBar
                   genres={genreData.genres}
                   ratings={ratingData.certifications.US.sort((a, b) => a.order - b.order)}
                   selectedFilters={appliedFilters}
                   onFilterClick={(filter) => handleFilterButtons(filter)}
               />
            </div>
            <div className="w-3/4 grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-2 gap-4">
                {items.map((movie: MovieListResult) => (
                    <div>
                        <Moviebox key={movie.id} item={movie}></Moviebox>
                    </div>))}
            </div>
        </div>
    )
}


type FilterSidebarProps = {
    genres: Genre[]
    ratings: Rating[]
    selectedFilters: number[],
    onFilterClick: (id: number) => void
}

const FilterSideBar = (
    { genres, selectedFilters, onFilterClick, ratings }: FilterSidebarProps
) => {
    return (
        <div className="ms-4 me-4">

            <Card className="rounded-md shadow-card p-4">
                <h2 className="sm:text-3xl font-semibold p-1">Sort</h2>
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Theme"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>
            </Card>

            <Card className="rounded-md shadow-card mt-4 mb-4">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight m-4">Genres</h2>
                {genres.map(({id, name}) => {
                    const selected = selectedFilters.includes(id)
                    return (
                        <Badge
                            className="hover:bg-primary rounded-md ms-2 mb-1"
                            onClick={() => onFilterClick(id)}
                            variant={selected ? "default" : "outline"}
                            id={id.toString()}
                        >{name}
                        </Badge>
                    )
                })}
                <div className="p-2"/>

                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight m-4">Ratings</h2>
                {ratings.map((rating) => {
                    const selected = false
                    return (
                        <Badge
                            className="hover:bg-primary rounded-md ms-2 mb-1"
                            onClick={() => {}}
                            variant={selected ? "default" : "outline"}
                            id={rating.order.toString()}
                        >{rating.certification}
                        </Badge>
                    )
                })}
                <div className="p-2"/>
            </Card>
        </div>
    )
}


export default MovieboxScroll