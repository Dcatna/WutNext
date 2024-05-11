import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import defaultimage from "./user_default.jpg"
import { replyType } from './CommentBox'

interface actualReply{
    reply : replyType
}
const ReplyBox = ({reply} : actualReply) => {
    //const [userImage, setUserImage] = useState<string>()
   // const date = new Date(reply.created_at)
    const [image, setImage] = useState<string>("")
    const [showReplies, setShowReplies] = useState(false)
    const [replies, setReplies] = useState<replyType[]>([])

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
    useEffect(() => {
        console.log(reply.users?.username, "USERS")
        getImageUrl(reply.users?.profile_image)
    }, [])
  return (
    <div className='flex'>
        <img className="rounded-full h-12 w-12 border-2 border-gray-300" src={image} alt="" />
        <div className='col ml-2'>
             <div className='flex text-black'>
                {reply.users?.username}
                <div className='ml-2'>
                    {/* {date.toLocaleDateString("en-US", {
                        month : 'long',
                        day : 'numeric',
                        year : 'numeric'
                    })} */}
                </div>
                {reply.message}
            </div>
        </div>
    </div>
  )
}

export default ReplyBox