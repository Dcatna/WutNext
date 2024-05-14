import React, { useEffect, useState } from 'react'
import { commentType } from './MovieInfo'
import { supabase } from '../lib/supabaseClient'
import { number } from 'yup'
import defaultimage from "./user_default.jpg"
import { CommentWithReply } from './CommentPopup'
import { Divide } from 'lucide-react'
import ReplyBox from './ReplyBox'
type Props = {}
export interface Comment{
    comment : CommentWithReply
    singleComment : boolean
    onReplyClick : (() => void) | undefined
    replyActive : boolean 
    refreshReplies : (() => void) | undefined
}
export interface replyType{
    id : number,
    created_at : string,
    user_id : string,
    message : string,
    cid : number
    user : {username : string | undefined, profile_image : string | undefined}
}
const CommentBox = ({comment, singleComment, onReplyClick, replyActive, refreshReplies} : Comment) => {
    //const [userImage, setUserImage] = useState<string>()
    const date = new Date(comment.created_at)
    const [image, setImage] = useState<string>("")
    const [showReplies, setShowReplies] = useState(false)
    const [replies, setReplies] = useState<replyType[]>([])
    const [toggleRelpy, setToggleReply] = useState(false)

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
    async function getReplies(){
        const {data, error} = await supabase.from("reply").select("*, user:users!reply_user_id_fkey(username, profile_image)").eq("cid", comment.id).order("created_at", {ascending: false})
        
            //console.log(data as replyType[], "REPLY")
            setReplies(data as replyType[])
            
        
    }
    useEffect(() => {
      
        getImageUrl(comment.profile_image)
        getReplies()
    },[replyActive, refreshReplies])
    const toggleReplies = async () => {
        await getReplies()
        setShowReplies(!showReplies)
    }
    console.log(replies, "REPLY")
  return (
    <div className='flex'>
        <img className="rounded-full h-12 w-12 border-2 border-gray-300" src={image} alt="" />
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

                <p onClick={onReplyClick} className='cursor-pointer ml-2 '>Reply</p>
                {comment.replies > 0 && !showReplies && <p onClick={toggleReplies} className='break-words ml-3 cursor-pointer'>View {comment.replies} more reply</p>}
                {showReplies && (
                    <div className='ml-2'>
                        {replies.map((reply : replyType) => (
                            <div>
                                <ReplyBox key={reply.id} reply={reply}></ReplyBox>
                            </div>
                        ))}
                        <p className = "cursor-pointer" onClick={toggleReplies}>Hide Replies</p>
                    </div>
                )}
                
            </div>}
        </div>
    </div>
  )
}

export default CommentBox