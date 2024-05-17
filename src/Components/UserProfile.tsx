import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CommentWithReply } from './CommentPopup'
import { supabase } from '../lib/supabaseClient'
import defaultimage from './user_default.jpg'
import { PosterLists, UserList } from '../Pages/Home'
import { useQuery } from '@tanstack/react-query'
import { selectListsWithPosters } from '../data/userlists'
import { CurrentUserContext } from '../App'
import Lists from '../Pages/Lists'

type Props = {}

const UserProfile = (props: Props) => {
    const location = useLocation()
    const comment : CommentWithReply = location.state
    const client = useContext(CurrentUserContext)
    const [image, setImage] = useState("")
    const [lists, setLists] = useState<UserList[]>([])
    const getImageUrl = (profile_image : string | undefined) => {
        
        if (profile_image) {
            const {data} = supabase.storage.from("profile_pictures").getPublicUrl(profile_image)
            
            if(data.publicUrl != undefined){
                setImage(data.publicUrl)
            }
            
        }
        else{
            setImage(defaultimage)
        }
    }
    async function getLists(){
        const {data, error} = await supabase.from("userlist").select("*").eq("user_id", comment.user_id).eq("public" , true)
        if(error) {
            throw error
        }
        setLists(data as UserList[])
        console.log(data as UserList[])
    }
    const listQuery = useQuery({
        queryKey: ['user_lists', comment.user_id],
        queryFn: async () => {
            return await selectListsWithPosters(comment.user_id)
        },
    })
    useEffect(() => {
        getImageUrl(comment.profile_image)
        getLists()
    }, [])

  return (
    <div>
        <div className='overflow-x-hidden'>
            <div className="bg-white shadow-lg rounded-lg p-4 max-w-sm mx-auto mt-10">
                <div className="flex justify-center">
                    <img className="rounded-full h-24 w-24 border-2 border-gray-300" src={image} alt="profile picture" />
                    <h2 className="mt-7 ml-4 text-center text-xl font-semibold text-black ">{comment.username}</h2>
                </div>    
            </div>
        </div>

        <div>
            {lists.length == 0 ? <p>Users has either no lists or no public lists</p> : 
            listQuery.data?.map((lst: PosterLists) => (
                <Lists item={lst} ></Lists>
        ))}
        </div>
    </div>
  )
}

export default UserProfile