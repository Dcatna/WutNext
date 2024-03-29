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
      const {data, error} = await supabase.from("userlist").select("name, list_id")
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
      }, [])
    
      async function handleOnClick(list_id : string){
        if(show == undefined){
            const {data, error} = await supabase.from("listitem").insert({
                "list_id" : list_id,
                "movie_id" : movie!!.item.id,
                "show_id" : -1,
                "user_id" : client?.user.id
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
        <Popup modal nested trigger={<Button className='w-[200px] h-[50px] rounded-md bg-blue-500'>Add To List!</Button>}>
            <div className='flex justify-center items-center'>
                <div className='p-10 bg-white rounded-md shadow-md w-[200px] min-w-sm'>
                    {userLists.map(list => (
                        <div onClick={() => handleOnClick(list.list_id)} className='px-2 py-1 my-2 text-black items-center justify-center border border-md border-black cursor-pointer hover:bg-gray-200'>
                            {list.name}
                        </div>
                    ))}
                </div>
            </div>
        </Popup>
    );
};

export default MovieBoxPopup;
