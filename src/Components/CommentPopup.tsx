import React, { useContext, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { Button } from "./Button";
import { commentType } from "./MovieInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faComment } from "@fortawesome/free-solid-svg-icons";
import { Divide } from "lucide-react";
import CommentBox from "./CommentBox";
import { supabase } from "../lib/supabaseClient";
import { CurrentUserContext } from "../App";
import { UUID } from "crypto";
import { commentWithReply } from "./CommentWithReplies";
import { act } from "react-dom/test-utils";

interface allComments {
  movieorshow: number;
  isMovie: boolean;
}
export interface CommentWithReply{
    id : number,
    user_id : string | undefined,
    movie_id : number,
    show_id : number,
    created_at : string,
    message : string,
    profile_image : string | undefined,
    likes : number,
    user_liked : boolean,
    replies : number,
    total : number,
    username : string | undefined 
}
const CommentPopup = ({ movieorshow, isMovie }: allComments) => {
  const client = useContext(CurrentUserContext);
  const [currComment, setCurrComment] = useState<string>("");
  const [allComment, setAllComment] = useState<CommentWithReply[]>([]);
  const [activeReply, setActiveReply] = useState<number | null>(null)
  //console.log(allComment, comments)

  async function getComments() {
    if(isMovie == true) {
        console.log(client?.user.id)
        const res = await commentWithReply(client?.user.id, movieorshow, -1)
        setAllComment(res as CommentWithReply[])
        
    }else{
      const res = await commentWithReply(client?.user.id, -1, movieorshow)
        setAllComment(res as CommentWithReply[])
    }
  }
  useEffect(() => {
    getComments().catch()
  }, [movieorshow]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent the default form submission behavior
    const date = new Date().toISOString;
    if(currComment != ""){
      if(!activeReply){
        
        if (isMovie == true) {
          const { data, error } = await supabase
            .from("comment")
            .insert({
              user_id: client?.user.id,
              created_at: date,
              message: currComment,
              movie_id: movieorshow,
              show_id: -1,
            })
          if (error) {
            throw error;
          } else {
            getComments()
            setCurrComment("");
            //console.log(allComment, "ALLLLL")
          }

        }else{
          const { data, error } = await supabase
            .from("comment")
            .insert({
              user_id: client?.user.id,
              created_at: date,
              message: currComment,
              movie_id: -1,
              show_id: movieorshow,
            }).select();
          if (error) {
            throw error;
          } else {
            setActiveReply(null)
            getComments()
            
            setCurrComment("");
          }
        }
      }else{
        const {data, error} = await supabase.from("reply").insert({created_at : date, user_id : client?.user.id, message : currComment, cid : activeReply})
        if(error) {
          throw error
        }else{
          //setAllComment([])
          getComments()
          setActiveReply(null)
          setCurrComment("")
        }
      }
    }
  }
  const handleReply = (commentId : number) => {
    setActiveReply(commentId)
  }
  return (
    <Popup
      className="overflow-hidden"
      contentStyle={{
        width: "100%",
        maxWidth: "600px",
        height: "100%",
        maxHeight: "800px",
      }}
      modal
      nested
      trigger={
        <div className="flex w-full cursor-pointer">
          <p>View more comments...{allComment.length}</p>
          <div className="ml-1">
            <FontAwesomeIcon icon={faComment} />
          </div>
        </div>
      }
    >
      <div className="overflow-y-auto max-h-[93vh]">
        {allComment.map((comment: CommentWithReply) => (
          <div className="mt-2">
            <CommentBox
              comment={comment}
              key={comment.id}
              singleComment={false} 
              onReplyClick={() => handleReply(comment.id)} 
              replyActive={false} 
              refreshReplies={activeReply === comment.id ? () => getComments() : undefined}             
            ></CommentBox>
          </div>
        ))}
      </div>
      <form
        className="flex w-full items-center"
        onSubmit={(event) => handleSubmit(event)}
      >
        <input
          className="bg-gray-100 rounded-md flex-1 p-2 text-black"
          placeholder={activeReply ? "replying..." : "Comment..."}
          type="text"
          value={currComment}
          onChange={(letter) => setCurrComment(letter.target.value)}
        />
        <Button type="submit" className="px-4 text-black font-bold">
          Post
        </Button>
        {activeReply && (
          <Button onClick={() => setActiveReply(null)}>Cancel</Button>
        )}
      </form>
    </Popup>
  );
};

export default CommentPopup;
