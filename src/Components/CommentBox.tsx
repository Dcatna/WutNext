import React, { useEffect, useState } from 'react'
import { commentType } from './MovieInfo'
import { supabase } from '../lib/supabaseClient'
import { number } from 'yup'
import defaultimage from "./user_default.jpg"
import { CommentWithReply } from './CommentPopup'
type Props = {}
export interface Comment{
    comment : CommentWithReply
    singleComment : boolean
}
const CommentBox = ({comment, singleComment} : Comment) => {
    //const [userImage, setUserImage] = useState<string>()
    const date = new Date(comment.created_at)
    const [image, setImage] = useState<string>("")
    const getImageUrl = () => {
        
        if (comment.profile_image) {
            const {data} = supabase.storage.from("profile_pictures").getPublicUrl(comment.profile_image)
            
            if(data.publicUrl != undefined){
                setImage(data.publicUrl)
            }
            
        }
        else{
            setImage(defaultimage)
        }
    }
    useEffect(() => {
        getImageUrl()
    },[])
    console.log(image)
  return (
    <div className='flex'>
        <img className="rounded-full h-20 w-20 border-2 border-gray-300" src={image} alt="" />
        <div className='col ml-2'>
            {singleComment == true ?
            <div className='flex text-white'>
                {comment.username}
                <div className='ml-2'>
                    {date.toLocaleDateString("en-US", {
                        month : 'long',
                        day : 'numeric',
                        year : 'numeric'
                    })}
                </div>
            </div> :  <div className='flex text-black'>
                {comment.username}
                <div className='ml-2'>
                    {date.toLocaleDateString("en-US", {
                        month : 'long',
                        day : 'numeric',
                        year : 'numeric'
                    })}
                </div>
            </div>}
            {singleComment == true ? <div className='text-white break-words overflow-hidden w-[400px]'>
                <p className='break-words'>{comment.message}</p>
            </div> : <div className='text-black break-words overflow-hidden w-[400px] flex flex-col'>
                <p className='break-words'>{comment.message}</p>
                {comment.replies == 0 ? <div></div> : <p className='break-words'>--Replies {comment.replies}</p>}
                
            </div>}
        </div>
    </div>
  )
}

export default CommentBox