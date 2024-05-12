import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Button } from '../Components/Button'
import Popup from './Popup'
import { CurrentUserContext } from '../App'
import { supabase } from '../lib/supabaseClient'
import movieicon from "./movieicon.png"
import defualtmovie from "./defaultlist.png"
import HorizontalMovieScroll from './HorizontalMovieScroll'
//import {ScrollArea} from ""
import "./rand.css"
import {Link, Outlet} from 'react-router-dom'
import Lists from './Lists'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBorderAll,faGripLines, faPlus, faGripLinesVertical} from '@fortawesome/free-solid-svg-icons'
import { favs } from '../Components/Profile'
import defaultList from "./default_favorite_list.jpg"
import {getListsByUserId, selectListsWithPosters} from "../data/userlists";
import {useQuery} from "@tanstack/react-query";
export interface UserList {
    list_id: string
    user_id: string 
    name: string
    created_at: string 
    updated_at: string 
    public: boolean
    description: string
    subscribers: number
}
export interface PosterLists {
    createdAt: string
    description: string
    list_id: string
    name: string
    public: boolean
    updatedAt: string
    userId: string
    username: string
    profileImagePath: string | null
    ids: string[] | null
    total: number | null
}

const Home = () => {

    const [refresh, setRefresh] = useState(0)
    const client = useContext(CurrentUserContext)
    const [favorites, setFavorites] = useState<favs[]>([])

    const listQuery = useQuery({
        queryKey: ['user_lists', client?.user.id],
        queryFn: async () => {
            return await selectListsWithPosters(client?.user.id)
        },
    })


    useEffect(() => {
        async function getFavorites(){
            const {data, error} = await supabase.from("favoritemovies").select("*")
            if(error) {
              console.log(error)
            }
            console.log(data as favs[], "favs")
            setFavorites(data as favs[])
        
          }
        getFavorites()
    }, [client, refresh])

    function handleClick() {
        setRefresh(prev => prev+1)
    }
  return (
    
    <div className='flex mt-5 overflow-y-hidden'>
        <div className='flex flex-grow overflow-y-auto'>
            <div className='w-1/4 sticky min-h-screen bg-custom-bluegray'>
                <div>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center'>
                            <FontAwesomeIcon className='mt-1 size-6' icon={faGripLinesVertical} />
                            <p className='ml-1 text-lg'>Your Library</p>
                        </div>
                        <div onClick={handleClick} className='mt-1 hover:bg-slate-800'>
                            <Popup></Popup>
                        </div>
                    </div>
                </div>
                <div className='mt-1'>
                <Link to="/home/favorites">
                    <div className='w-full rounded-md hover:bg-black/50 text-center flex flex-relative p-1'> 
                        <div className='w-[65px] grid grid-cols rounded-lg overflow-hidden'>
                            <img src={defaultList} alt="" className='w-full h-full object-cover aspect-1'/>
                        </div>
                        <div className='flex items-center ml-2'>
                            <div className='flex flex-col '>
                                <p className='text-left'>Favorites </p>
                                <p className='text-left'>Created By: {client?.user.email?.slice(0, client?.user.email?.indexOf("@"))}</p>
                            </div> 
                        </div>
                    </div>
                </Link>
                {listQuery.data?.map((lst: PosterLists) => (
                        <Lists item={lst} ></Lists>
                ))}
                </div>
            </div>
            <Outlet />
        </div>
    </div>
  )
}

export const ContentPreview = () => {
    return (
        <div className='w-3/4  ml-2'>
            <p className='text-bold'>Popular Movies</p>
            <div className='overflow-x-auto'>
                <HorizontalMovieScroll movieType={'popular'} showType={undefined}
                                       movieOrShow={"movie"}></HorizontalMovieScroll>
            </div>
            <div className='mt-2'>
                <p>Top Rated Movies</p>
                <div className='overflow-x-auto'>
                    <HorizontalMovieScroll movieType={'top_rated'} showType={undefined}
                                           movieOrShow={"movie"}></HorizontalMovieScroll>
                </div>
            </div>
            <div className='mt-2'>
                <p>Upcoming Movies</p>
                <div className='overflow-x-auto'>
                    <HorizontalMovieScroll movieType={'upcoming'} showType={undefined}
                                           movieOrShow={"movie"}></HorizontalMovieScroll>
                </div>
            </div>
            <div className='mt-2'>
                <p>Popular Shows</p>
                <div className='overflow-x-auto'>
                    <HorizontalMovieScroll movieType={undefined} showType={"popular"}
                                           movieOrShow={"tv"}></HorizontalMovieScroll>
                </div>
            </div>
            <div className='mt-2'>
                <p>Top Rated Shows</p>
                <div className='overflow-x-auto'>
                    <HorizontalMovieScroll movieType={undefined} showType={"top_rated"}
                                           movieOrShow={"tv"}></HorizontalMovieScroll>
                </div>
            </div>
            <div className='mt-2'>
                <p>Shows Airing Today</p>
                <div className='overflow-x-auto'>
                    <HorizontalMovieScroll movieType={undefined} showType={"airing_today"}
                                           movieOrShow={"tv"}></HorizontalMovieScroll>
                </div>
            </div>
        </div>
    )
}

export default Home