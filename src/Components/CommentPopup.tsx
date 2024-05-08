import React from 'react'
import Popup from 'reactjs-popup';
import { Button } from './Button';
import { commentType } from './MovieInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faComment} from '@fortawesome/free-solid-svg-icons'
//import { Divide } from 'lucide-react';
import CommentBox from './CommentBox';
import { supabase } from '../lib/supabaseClient';

type Props = {}
interface allComments{
    comments : commentType[]
}
const CommentPopup = (comments : allComments) => {
    async function handleSubmit(){
        const {data, error} = await supabase.from("comment").insert("")
    }
  return (
    <Popup className='overflow-hidden' contentStyle={{width:'100%', maxWidth:'600px', height:'100%', maxHeight:'800px'}} modal nested trigger={<div className='flex w-full cursor-pointer'> <p>View more comments...{comments.comments.length}</p><div className='ml-1'><FontAwesomeIcon icon={faComment} /></div></div>}>
        <div className='overflow-y-auto max-h-[93vh]'>
            {comments.comments.map((comment : commentType )=> (
                <div className='last'>
                    <CommentBox comment={comment} key={comment.id}></CommentBox>
                </div>
            ))}
            
        </div>
        <form action="submit" className='flex w-full items-center'>
                    <input className='bg-gray-100 rounded-md flex-1 p-2 text-black' placeholder='Comment...' type="text" />
                    <Button type='submit' className='px-4 text-black font-bold'> Post</Button>
        </form>
    </Popup>
  )
}

export default CommentPopup