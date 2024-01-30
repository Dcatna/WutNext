import React from 'react'

type Props = {}
export interface Root {
    page: number
    results: Result[]
    total_pages: number
    total_results: number
  }
  
  export interface Result {
    adult: boolean
    backdrop_path: string
    genre_ids: number[]
    id: number
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
  }
  interface movieRatedProp {
    item : Result
}
const MovieRatedBox = ({item} : movieRatedProp) => {
    const partial_url = "https://image.tmdb.org/t/p/w200"
    return (
      <div style={{
          width:"100px",
          margin:'25px'
      }}>
          <div style={{
                  outlineColor: "black",
                  alignItems: "center",
                  border: "1.5px",
                  borderStyle: "solid",
                  borderRadius: "5px",
                  borderColor: "black",
                  marginBottom:"5px",
                  width:"150px",
                  height:'225px',
                  backgroundColor:'darkgrey',
              }}>
              <img src={partial_url + item.poster_path} alt="Movie Poster" style={{ width: '150px' }} />
          </div>
      </div>
    )
}

export default MovieRatedBox