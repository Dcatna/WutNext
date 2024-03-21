import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../Components/Button'
import Popup from './Popup'
import { CurrentUserContext } from '../App'
import { supabase } from '../lib/supabaseClient'

import HorizontalMovieScroll from './HorizontalMovieScroll'
//import {ScrollArea} from ""
import "./rand.css"
type Props = {}
interface userLists{
    list_name : string,
    list_id : string,
}
const Browse = (props: Props) => {
    const [userLists, setUserLists] = useState<userLists[]>()
    const client = useContext(CurrentUserContext)
    useEffect(() => {
        async function getLists(){
            const {data, error} = await supabase.from("userlist").select("list_name, list_id")
            if(error){
                console.log(error)
            }
            else{
                setUserLists(data as userLists[])
            }
        }
        getLists()
    }, [])
  return (
    <div className='flex h-screen overflow-hidden mt-5'>
        <div className='flex flex-grow'>
            <div className='w-1/4 h-screen overflow-y-auto bg-gray-500 '>
                <Popup></Popup>
                <div className=''>
                {userLists?.map((lst: userLists) => (
                    <div className='text-black' key={lst.list_id}>{lst.list_name}</div>
                ))}
                </div>
            </div>
            <div className='w-3/4 h-screen ml-2'>
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

const Lists = () => {
    return (
       <div></div> 
    )
}
export default Browse