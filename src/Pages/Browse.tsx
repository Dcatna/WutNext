import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../Components/Button'
import Popup from './Popup'
import { CurrentUserContext } from '../App'
import { supabase } from '../lib/supabaseClient'
import { UUID } from 'crypto'
import HorizontalMovieScroll from './HorizontalMovieScroll'

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
            <div className='w-1/4 h-screen overflow-y-auto bg-gray-500'>
                <Popup></Popup>
                <div className=''>
                {userLists?.map((lst: userLists) => (
                    <div className='text-black' key={lst.list_id}>{lst.list_name}</div>
                ))}
                </div>
            </div>
            <div className='w-3/4 h-screen overflow-y-auto ml-2'>
                movies shows
                <HorizontalMovieScroll movieType={'popular'} ></HorizontalMovieScroll>
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