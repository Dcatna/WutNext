import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../Components/Button'
import Popup from './Popup'
import { CurrentUserContext } from '../App'
import { supabase } from '../lib/supabaseClient'

import HorizontalMovieScroll from './HorizontalMovieScroll'
//import {ScrollArea} from ""
import "./rand.css"
import { Link } from 'react-router-dom'

export interface userLists{
    name : string,
    list_id : string,
}
const Browse = () => {
    const [userLists, setUserLists] = useState<userLists[]>()
    const client = useContext(CurrentUserContext)
    useEffect(() => {

        async function getLists(){
            const {data, error} = await supabase.from("userlist").select("name, list_id")
            console.log(data, "lsits")
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
    <div className='flex mt-5 overflow-y-hidden'>
        <div className='flex flex-grow overflow-y-auto'>
            <div className='w-1/4 sticky bg-slate-900'>
                <Popup></Popup>
                <div className=''>
                {userLists?.map((lst: userLists) => (
                    <Lists name={lst.name} list_id={lst.list_id}></Lists>
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

const Lists = (listItemName : userLists) => {
    return (
       <Link to={''}>
            <div className='h-20 w-full rounded-md border-black border text-center justify-center items-center flex'>
                {listItemName.name}
            </div> 
       </Link>
    )
}
export default Browse