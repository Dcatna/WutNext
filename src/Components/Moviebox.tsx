import React from 'react'
import {MovieListResult} from "../data/types/MovieListResponse";

  
interface movieBoxProp {
    item : MovieListResult
}

const shortenedDesc = (overview : string | undefined) => {
    if(overview?.length??0 > 75) {
        const reduced = overview?.substring(0, 75)
        return reduced + "..."
    }
    else{
        return overview
    }
}
const Moviebox = ({item} : movieBoxProp) => {
    const partial_url = "https://image.tmdb.org/t/p/original/"
    return (
        <div className="group relative">
            <img
                className="w-full h-full rounded-md animate-in"
                src={partial_url + item.poster_path}
                alt="Movie Poster"
            />
            <div className="rounded-md absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent w-full h-4/6"/>
            <div className="rounded-md absolute bottom-0 left-0 h-full w-full hover:bg-gradient-to-t from-slate-900 to-transparent bg-transparent"/>
            <text
                className="rounded-md line-clamp-2 absolute bottom-0 left-0 m-2 group-hover:animate-bounce">
                {item.title}
            </text>
        </div>
    )
}

export default Moviebox