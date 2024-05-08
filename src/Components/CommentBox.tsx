import React, { useEffect, useState } from 'react'
import { commentType } from './MovieInfo'
import { supabase } from '../lib/supabaseClient'
import { number } from 'yup'
import defaultimage from "./user_default.jpg"
type Props = {}
interface Comment{
    comment : commentType
}
const CommentBox = ({comment} : Comment) => {
    //const [userImage, setUserImage] = useState<string>()
    const date = new Date(comment.created_at)
    
  return (
    <div className='flex'>
        <img className="rounded-full h-20 w-20 border-2 border-gray-300" src={supabase.storage.from("profile_pictures").getPublicUrl(comment.users.profile_image!!).data.publicUrl || defaultimage} alt="" />
        <div className='col ml-2'>
            <div className='flex text-black'>
                {comment.users.username}
                <div className='ml-2'>
                    {date.toLocaleDateString("en-US", {
                        month : 'long',
                        day : 'numeric',
                        year : 'numeric'
                    })}
                </div>
            </div>
            <div className='text-black break-words overflow-hidden w-[400px]'>
                <p className='break-words'>{comment.message}</p>
            </div>
        </div>
    </div>
  )
}

export default CommentBox