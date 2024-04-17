import { Link } from "react-router-dom"
import { PL } from "./Browse"
import { useContext, useMemo } from "react"
import movieicon from "./movieicon.png"
import { CurrentUserContext } from "../App"
const Lists = ({item} : PL) => {
    const client = useContext(CurrentUserContext)
    const posters = useMemo<string[]>(() => {
        if(!item.ids){
            return []
        }
        if(item.ids.length < 4){
               const posterData = item.ids!![0].split(",")
               return [posterData[2]]
        }
        
        else{
            return (item.ids?.map(poster => {
                const posterData = poster.split(",")
                return posterData[2]
            }) ?? []) 
        }
    }, [item.ids])
    
    return (
        
       <Link to={'/listitems'} state={item}>
            <div className='w-full rounded-md hover:bg-black/50 text-center flex flex-relative p-1'>   
                {posters.length == 1 ? 
                    <div className='w-[85px] grid grid-cols rounded-lg overflow-hidden'>
                        <img src={`https://image.tmdb.org/t/p/original//${posters[0]}`} alt="" className='w-full h-full object-cover aspect-1'/>
                    </div>
                     : posters.length > 1 ?
                    
                <div className='grid grid-cols-2 w-[85px] rounded-lg overflow-hidden'>
                {posters.map((post) => (
                     <div className='w-full relative'>
                        <img src={`https://image.tmdb.org/t/p/original//${post}`} alt="" className='w-full h-full object-cover aspect-1'/>
                    </div>
                ))} </div>: <div className='w-[85px] grid grid-cols rounded-lg overflow-hidden'><img src={movieicon} className='w-full h-full object-cover aspect-1'></img></div>}   
                <div className='flex items-center ml-2'>
                    <div className='flex flex-col'>
                        <p className='text-left'>{item.name}</p>
                        <p className='text-left'>Created By: {item.username}</p>
                    </div>  
                </div>

            </div> 
       </Link>
    )
}
export default Lists