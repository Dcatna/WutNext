import React, {useContext, useEffect, useRef, useState} from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../Components/Button';
import { CurrentUserContext } from '../App';
import { movieBoxProp } from './Moviebox';
import { showBoxProp } from './Showbox';
export interface userLists{
    name : string,
    list_id : string,
  }
interface MoviePop {
    movie : movieBoxProp | undefined,
    show : showBoxProp | undefined
}
const MovieBoxPopup = ({movie, show} : MoviePop) => {
    const [name, setName] = useState("");
    const client = useContext(CurrentUserContext)
    const [userLists, setUserLists] = useState<userLists[]>([])
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
    useEffect(() => {
        getLists()
      }, [client])
    
      async function handleOnClick(list_id : string){
        if(show == undefined){
            const {data, error} = await supabase.from("listitem").insert({
                "list_id" : list_id,
                "movie_id" : movie!!.item.id,
                "show_id" : -1,
                "user_id" : client?.user.id,
                "poster_path" : movie?.item.poster_path.slice(1, movie.item.poster_path.length)
            })
            if(error) {
                console.log(error)
            }
        }
        else{
            const {data, error} = await supabase.from("listitem").insert({
                "list_id" : list_id,
                "movie_id" : -1,
                "show_id" : show.item.id,
                "user_id" : client?.user.id
            })
            if(error) {
                console.log(error)
            }
        }
        
      }

    return (
        <Popup contentStyle={{ width: "400px" }} modal nested trigger={<Button className='w-[200px] h-[50px] rounded-md bg-blue-500'>Add To List!</Button>}>
    <div className='flex justify-center items-center flex-col bg-slate-900 '>
        <p className=' '>Your Lists</p>
        <div className='p-6 rounded-md shadow-md min-w-sm bg-slate-900'>
            {userLists.length > 0 ? (
                userLists.map(list => (
                    <div key={list.list_id} onClick={() => handleOnClick(list.list_id)} className='bg-indigo-300 px-2 py-1 my-2 text-black items-center justify-center border border-md border-black cursor-pointer hover:bg-gray-200'>
                        {list.name}
                    </div>
                ))
            ) : (
                <p>No lists found.</p>
            )}
        </div>
    </div>
</Popup>

    );
};

export default MovieBoxPopup;
