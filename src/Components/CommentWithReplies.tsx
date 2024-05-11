import { UUID } from "crypto";
import { supabase } from "../lib/supabaseClient";
import { CommentWithReply } from "./CommentPopup";

export async function commentWithReply(client : string | undefined, movie_id : number, show_id : number) : Promise<CommentWithReply[]> {
    const {data, error} = await supabase.rpc("select_comments_for_content_with_info", { uid: null,  lim: 9999, off: 0, mid : movie_id, sid : show_id} as {uid : UUID | null, lim : number, off: number,  mid : number, sid:number})
    if(error) {
        throw error
    }else{
        return data
    }
}
