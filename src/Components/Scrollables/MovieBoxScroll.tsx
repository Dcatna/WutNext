import React, {useContext, useEffect, useMemo, useState} from 'react'
import genreData from './genres.json'
import ratingData from './ratings.json'
import {useInfiniteQuery} from '@tanstack/react-query';
import Moviebox from '../Moviebox';
import {Badge} from "../Badge";
import {Card} from "../Card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../Select";
import {MovieListResult} from "../../data/types/MovieListResponse";
import {TMDBClientContext} from "../../App";
import {Genre, Rating} from "../../data/types/types";


const MovieboxScroll = () => {

    const [appliedFilters, setAppliedFilters] = useState<number[]>([])
    const [genresString, setGenresString] = useState<string>("")
    const client = useContext(TMDBClientContext)

    const handleFilterButtons = (filter : number) => {
        setAppliedFilters((prevFilters : number[]) =>
            prevFilters.includes(filter)
                ? prevFilters.filter((it) => it !== filter)
                : [...prevFilters, filter]
        )
    }

    useEffect(() => {
        const newStr = filterStringBuilder(appliedFilters);
        setGenresString(newStr);
    }, [appliedFilters]);

    const filterStringBuilder = (appliedFilters : number[]) => {
        let retString = "";
        for (let i = 0; i < appliedFilters.length; i++) {
            if (i === appliedFilters.length - 1) {
                retString += appliedFilters[i].toString();
            } else {
                retString += appliedFilters[i].toString() + ",";
            }
        }
        return retString;
    }
    
    const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['trendingMovies', genresString],
        queryFn: ({ pageParam }) => client.fetchMovieList(pageParam, "movie", genresString),
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

        return data?.pages.flatMap((page) => page.results) ?? []

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
                            itemID={id.toString()}
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
                            itemID={rating.certification + rating.order}
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