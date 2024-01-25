import React, { useEffect, useState } from 'react'
import Moviebox, { Result, Root } from './Moviebox'
import { useAutoAnimate } from "@formkit/auto-animate/react";
import "./MovieboxList.css"
interface movieBoxListProp{
    items: Result[]
}
const itemsIndex = (items : Result[], currItem : Result) =>{
    for(let i = 0; i<items.length; i++) {
        if(items[i].title === currItem.title){
            return i
        }
    }
    return -1
}

const Movieboxlist = ({items} : movieBoxListProp) => {
    const [arr, setArr] = useState<Result[]>(items.slice(0, 3))
    const [animationParent] = useAutoAnimate()
    
    console.log(arr)
    const onLeftButtonClick = () => {
        const leftMost = itemsIndex(items, arr[0])

        if (leftMost !== -1 && items[leftMost - 1]) {
            setArr((prev) => [items[leftMost - 1], prev[0], prev[1]])
        }
    }

    const onRightButtonClick = () => {
        const last = itemsIndex(items, arr[2])
        console.log(last !== -1)
        if (last !== -1 && items[last + 1]) {
            setArr((prev) => [prev[1], prev[2], items[last + 1]])
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
        {arr.map((item: Result, index) => (
            <li key={index} style={{
                margin:'60px'
            }}>
                    <Moviebox item = {item}/>
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