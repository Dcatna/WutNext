import React, { useEffect, useState } from 'react'
import Moviebox, { Data } from './Moviebox'
import { useAutoAnimate } from "@formkit/auto-animate/react";
import "./MovieboxList.css"
export type MovieList = {
    items : Data[]
}

const Movieboxlist = ({items} : MovieList) => {
   // console.log(items, items.length)
    const [arr, setarr] = useState<Data[]>([items[0],items[1], items[2]]) 
    const [buttonClicks, setButtonClicks] = useState<number>(0)
    const [animationParent] = useAutoAnimate()
    
    console.log(arr)
    const onRightButtonClick = () => {
        //setButtonClicks(buttonClicks+1)
        
        console.log(items.indexOf(arr[2]) + 1)

        if(items.indexOf(arr[2]) === items.length - 1) { 
            setarr((prev) => {
                return [prev[1], prev[2], items[0]]
             })
       }
        else{
            setarr((prev) => {
                 return [prev[1], prev[2], items[items.indexOf(arr[2]) + 1]]
             })
        }
    }

    const onLeftButtonClick = () => {
        const leftMost = items.indexOf(arr[0]) - 1
        console.log(leftMost)
        if(leftMost >= 0){
            if(items[leftMost + 2]){
                setarr([items[leftMost], items[leftMost+1], items[leftMost+2]])
            }
        }
    }

  return (
    <div style={{
        display: "inline-flex",
        alignItems: "stretch",
        width: "max-content",
        backgroundColor: "#404040",
        paddingBottom: "15px",
    }}>
        <ul ref={animationParent} style={{ display: "flex", padding: 0, listStyle: "none",}}>
            <button onClick={()=>{onLeftButtonClick()}} style={{
                
            }}>
                LEFT
            </button>
        {arr.map((item: Data, index) => (
            <li key={index} style={{
                margin:'60px'
            }}>
                    <Moviebox 
                    overview={item.overview}
                    release_date={item.release_date}
                    vote_average={item.vote_average}
                    poster_path={item.poster_path} title={undefined}                    />
                </li>
                ))}
            <button onClick={() => {onRightButtonClick()}} style={{
                marginLeft:'60px'
            }}>RIGHT</button>
        </ul>
    </div>
  )
}

export default Movieboxlist