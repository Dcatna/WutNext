import React, { useContext } from 'react'
import {MovieListResult, ShowListResult} from "../data/types/MovieListResponse";
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { CurrentUserContext } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBorderAll,faGripLines, faStar, fas, faMinusCircle} from '@fortawesome/free-solid-svg-icons'
import { UserList } from '../Pages/Browse';

export interface showBoxProp{
    item : ShowListResult
    inList: boolean
    lst : UserList | undefined
}

const Showbox = ({item, inList, lst} : showBoxProp) => {
    const partial_url = "https://image.tmdb.org/t/p/original/"
    const client = useContext(CurrentUserContext)
    async function handleFavorites(event: React.MouseEvent, item: ShowListResult) {
        event.preventDefault(); // Prevent link navigation
        event.stopPropagation();
        const {data, error} = await supabase.from("favoritemovies").select("*").eq("show_id", item.id)
        console.log(data)
        if(data?.length == 0) {
            const {data, error} = await supabase.from("favoritemovies").insert([{
                movie_id: -1,
                show_id : item.id, 
                user_id: client?.user.id, 
                poster_path: item.poster_path,
                title: item.name,
                overview: item.overview,
                vote_average: item.vote_average  
                }])
            if(error) {
                console.log(error, "hi")
            }
            else{
                console.log(data)
            }
        }
        else{
            console.log("MOVIE IS ALREADY FAVORITED")
        }
        
    }
    async function handleDelete() {
        const {data, error} = await supabase.from("listitem").delete().match({"list_id" : lst?.list_id, "show_id" : item.id})
        if(error) {
            console.log(error)
        }else{
            window.location.reload()
        }
    }

    return (
        
        <Link to={'/showinfo'} state={{item}}>
            <div className="group relative">
            <div className="absolute top-0 right-0 m-2 z-10">
                <button onClick={(event) => handleFavorites(event, item)}>
                    <FontAwesomeIcon icon={faStar} />
                </button>
                {inList && 
                    <button onClick={handleDelete}>
                        <FontAwesomeIcon icon={faMinusCircle} className='text-red-500'/>
                    </button> }
            </div>
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