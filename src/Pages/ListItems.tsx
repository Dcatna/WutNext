import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { userLists } from './Browse'
import { supabase } from '../lib/supabaseClient'
type Props = {}
interface ListTypes{
    list_id : string,
    movie_id : number,
    show_id : number,
    user_id : string
}

const ListItems = (props: Props) => {
    const location = useLocation()
    const lst : userLists = location.state
    const [movieShows, setMovieShows] = useState<ListTypes[]>([])
    async function fetchMoviesShowsFromList(){
        const {data, error } = await supabase.from("listitem").select("*").eq("list_id", lst.list_id)
        if(error) {
            console.log(error)
        }else{
            console.log(data, "HELOOOO")
            setMovieShows(data as ListTypes[])
        }
    }

    useEffect(() => {
        fetchMoviesShowsFromList()
        
    }, [])
  return (
    
    <div>
        {movieShows.map((item : ListTypes) => (
            item.movie_id == -1 ? item.show_id : item.movie_id
        ))}
    </div>
  )
}

export default ListItems