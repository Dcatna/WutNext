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
import { Link } from 'react-router-dom'
import Lists from './Lists'

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
export interface PL {
    item : PosterLists
}
const Browse = () => {
    const [userLists, setUserLists] = useState<UserList[]>()
    const [posterPaths, setPosterPaths] = useState<PosterLists[]>()
    const [refresh, setRefresh] = useState(0)
    const client = useContext(CurrentUserContext)

    useEffect(() => {

        async function getLists(){
            const {data, error} = await supabase.from("userlist").select("*").eq("user_id", client?.user.id)
            console.log(data, "lsits")
            if(error){
                console.log(error)
            }
            else{
                setUserLists(data as UserList[])
            }
        }
        async function getListPictures() {
            const {data, error} = await supabase.rpc("select_lists_with_poster_items_for_user_id", { uid: client?.user.id,  lim: 9999, off: 0})
            if(error) {
                console.log(error)
            }
            else {
                const res = data as PosterLists[]
                setPosterPaths(res)
                
            }
        }

        getLists()
        getListPictures()
        
    }, [client, refresh])
    //console.log(posterPaths, "PICS")
    function handleClick() {
        setRefresh(prev => prev+1)
    }
  return (
    
    <div className='flex mt-5 overflow-y-hidden'>
        <div className='flex flex-grow overflow-y-auto'>
            <div className='w-1/4 sticky bg-custom-bluegray'>
                <div onClick={handleClick}>
                    <Popup></Popup>
                </div>
                <div className='mt-1'>
                {posterPaths?.map((lst: PosterLists) => (
                        <Lists item={lst} ></Lists>
                ))}
                </div>
            </div>
            <div className='w-3/4  ml-2'>
                <p className='text-bold'>Popular Movies</p>
                <div className='overflow-x-auto'>
                    <HorizontalMovieScroll movieType={'popular'} showType={undefined} movieOrShow ={"movie"}></HorizontalMovieScroll>
                </div>
                <div className='mt-2'>
                    <p>Top Rated Movies</p>
                    <div className='overflow-x-auto'>
                        <HorizontalMovieScroll movieType={'top_rated'} showType={undefined} movieOrShow ={"movie"}></HorizontalMovieScroll>
                    </div>
                </div>
                <div className='mt-2'>
                    <p>Upcoming Movies</p>
                    <div className='overflow-x-auto'>
                        <HorizontalMovieScroll movieType={'upcoming'} showType={undefined} movieOrShow ={"movie"}></HorizontalMovieScroll>
                    </div>
                </div>
                <div className='mt-2'>
                    <p>Popular Shows</p>
                    <div className='overflow-x-auto'>
                        <HorizontalMovieScroll movieType={undefined} showType={"popular"} movieOrShow ={"tv"}></HorizontalMovieScroll>
                    </div>
                </div>
                <div className='mt-2'>
                    <p>Top Rated Shows</p>
                    <div className='overflow-x-auto'>
                        <HorizontalMovieScroll movieType={undefined} showType={"top_rated"} movieOrShow ={"tv"}></HorizontalMovieScroll>
                    </div>
                </div>
                <div className='mt-2'>
                    <p>Shows Airing Today</p>
                    <div className='overflow-x-auto'>
                        <HorizontalMovieScroll movieType={undefined} showType={"airing_today"} movieOrShow ={"tv"}></HorizontalMovieScroll>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}


export default Browse