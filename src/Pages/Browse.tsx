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

export interface userLists{
    name : string,
    list_id : string,
}
interface PosterLists {
    createdAt: string;
    description: string;
    listId: string;
    name: string;
    public: boolean;
    updatedAt: string;
    userId: string;
    username: string;
    profileImagePath: string | null;
    ids: string[] | null;
    total: number | null;
}
interface PL {
    item : PosterLists
}
const Browse = () => {
    const [userLists, setUserLists] = useState<userLists[]>()
    const [posterPaths, setPosterPaths] = useState<PosterLists[]>()

    const client = useContext(CurrentUserContext)

    useEffect(() => {

        async function getLists(){
            const {data, error} = await supabase.from("userlist").select("name, list_id").eq("user_id", client?.user.id)
            console.log(data, "lsits")
            if(error){
                console.log(error)
            }
            else{
                setUserLists(data as userLists[])
            }
        }
        async function getListPictures() {
            const {data, error} = await supabase.rpc("select_lists_with_poster_items_for_user_id", { uid: client?.user.id,  lim: 9999, off: 0})
            if(error) {
                console.log("EHLLOOO")
                console.log(error)
            }
            else {
                const res = data as PosterLists[]
                console.log(res, "PICTURES")
                setPosterPaths(res)
                
            }
        }

        getLists()
        getListPictures()
        
    }, [client])
    //console.log(posterPaths, "PICS")
  return (
    
    <div className='flex mt-5 overflow-y-hidden'>
        <div className='flex flex-grow overflow-y-auto'>
            <div className='w-1/4 sticky bg-slate-900'>
                <Popup></Popup>
                <div className=''>
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

const Lists = ({item} : PL) => {
    const posters = useMemo<string[]>(() => {
        if(!item.ids){
            return []
        }
        if(item.ids.length < 4){
               const posterData = item.ids!![0].split(",")
               return [posterData[2]]
        }
        
        else{
            return (item.ids?.map(poster => {
                const posterData = poster.split(",")
                return posterData[2] ?? ""
            }) ?? []) 
        }
    }, [item.ids])

    console.log(posters, "Posters")
    return (
       <Link to={'/listitems'} state={item}>
            <div className='h-24 w-full rounded-md border-black border text-center  flex flex-relative'>   
                {posters.length == 1 ? 
                    <div className='w-[65px] h-[50px] grid grid-cols rounded-md'>
                        <img src={`https://image.tmdb.org/t/p/original//${posters[0]}`} alt="" className='w-full h-full object-cover'/>
                    </div>
                     : posters.length > 1 ?
                <div className='grid grid-cols-2 w-[65px] h-[15px] rounded-md'>
                {posters.map((post, ind) => (
                     <div className='w-full pb-full relative'>
                        <img src={`https://image.tmdb.org/t/p/original//${post}`} alt="" className='w-full h-full object-cover'/>
                    </div>
                ))} </div> : <div className='w-[65px] h-[100px] grid grid-cols rounded-md'><img src={movieicon} className='w-full h-full object-cover'></img></div>}   
                <div className='flex items-center ml-1'>
                    <div className='flex flex-col'>
                        <p className='text-left'>{item.name}</p>
                        <p className='text-left'>Created By: {item.username}</p>
                    </div>  
                </div>

            </div> 
       </Link>
    )
}
export default Browse