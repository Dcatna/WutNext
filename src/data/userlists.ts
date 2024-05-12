import {supabase} from "../lib/supabaseClient";
import {type PosterLists, type UserList} from "../Pages/Home";

export async function getListsByUserId(userId: string | undefined): Promise<UserList[]> {
    const {data} = await supabase
        .from("userlist")
        .select("*")
        .eq("user_id", userId)

    return data as UserList[]
}

export async function selectListsWithPosters(userId: string | undefined): Promise<PosterLists[]> {

    if (userId == undefined)
        return []

    const {data} = await supabase.rpc(
        "select_lists_with_poster_items_for_user_id",
        {
            uid: userId,
            lim: 9999,
            off: 0
        })
    return data as PosterLists[]
}