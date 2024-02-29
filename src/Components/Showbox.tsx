import React from 'react'
import {MovieListResult, ShowListResult} from "../data/types/MovieListResponse";
import { Link } from 'react-router-dom';


export interface showBoxProp{
    item : ShowListResult
}
  
const Showbox = ({item} : showBoxProp) => {
    const partial_url = "https://image.tmdb.org/t/p/original/"
    return (
        
        <Link to={'/info'} state={{item}}>
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
                    {item.name}
                </text>
            </div>
        </Link>
    )
}

export default Showbox