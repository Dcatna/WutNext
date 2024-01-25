import React from 'react'

export interface Root {
    page: number
    results: Result[]
    total_pages: number
    total_results: number
  }
  
  export interface Result {
    adult: boolean
    backdrop_path: string
    id: number
    title: string
    original_language: string
    original_title: string
    overview: string
    poster_path: string
    media_type: string
    genre_ids: number[]
    popularity: number
    release_date: string
    video: boolean
    vote_average: number
    vote_count: number
  }
  
interface movieBoxProp {
    item : Result
}
const shortenedDesc = (overview : string | undefined) => {
    if(overview?.length??0 > 75) {
        const reduced = overview?.substring(0, 75)
        return reduced + "..."
    }
    else{
        return overview
    }
}
const Moviebox = ({item} : movieBoxProp) => {
    const partial_url = "https://image.tmdb.org/t/p/w200"
  return (
    <div style={{
        width:"100px"
    }}>
        <div style={{
                outlineColor: "black",
                alignItems: "center",
                border: "1.5px",
                borderStyle: "solid",
                borderRadius: "5px",
                borderColor: "black",
                marginBottom:"5px",
                width:"200px",
                height:'450px',
                backgroundColor:'darkgrey'
            }}>
            <img src={partial_url + item.poster_path} alt="" />
            <p>{shortenedDesc(item.overview)}</p>
            <p>{item.vote_average}</p>
        </div>
    </div>
  )
}

export default Moviebox