import React, { useEffect, useMemo, useState } from 'react'
import { useMatch } from 'react-router-dom'
import { favs } from '../Profile'
import { supabase } from '../../lib/supabaseClient'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import FavoritesBox from '../FavoritesBox'

type Props = {}
const itemsIndex = (items : favs[], currItem : favs) =>{
    for(let i = 0; i<items.length; i++) {
        if(items[i].title === currItem.title){
            return i
        }
    }
    return -1
}

const UserProfile = (props: Props) => {
    const [animationParent] = useAutoAnimate()
    const [arr, setArr] = useState<favs[]>([])
    const [favorites, setFavorites] = useState<favs[]>([])
    
  
    async function getFavorites(){
      const {data, error} = await supabase.from("favoritemovies").select("*")
      if(error) {
        console.log(error)
      }
      console.log(data as favs[], "favs")
      setFavorites(data as favs[])
  
    }
    useEffect(() => {
        getFavorites()
      }, [])
    useEffect(() =>{
        if(arr.length === 0){
            setArr(favorites.slice(0, 3))
        }
    }, [favorites])

    console.log(arr, "hi")
    //if (isFetching && isFetchingNextPage) return <span>Loading...</span>;    
    console.log(arr)
    const onLeftButtonClick = () => {
        const leftMost = itemsIndex(favorites, arr[0])
        if (leftMost !== -1 && favorites[leftMost - 1]) {
            setArr((prev) => [favorites[leftMost - 1], prev[0], prev[1]])
        }
    }

    const onRightButtonClick = () => {
        const last = itemsIndex(favorites, arr[2])
        if(favorites[last+7] === undefined){
            
        }
        //console.log(last !== -1)
        if (last !== -1 ) {
            if(favorites[last + 1]){
                setArr((prev) => [prev[1], prev[2], favorites[last + 1]])
            }
        }
  
    }
  return (
    <div className='main-container'>
    <ul ref={animationParent} style={{ display: "flex", padding: 0, listStyle: "none",}}>
        <button className='slider-button-left' onClick={()=>{onLeftButtonClick()}} style={{
            
        }}>
            LEFT
        </button>
    {arr.map((item: favs) => (
        <li key={item.id} style={{
            margin:'5px'
        }}>
                <FavoritesBox item = {item}/>
            </li>
            ))}
        <button className='slider-button-right' onClick={() => {onRightButtonClick()}} style={{
            marginRight:'1000px',
            width:'100%'
        }}>RIGHT</button>
    </ul>
</div>
  )
}

export default UserProfile