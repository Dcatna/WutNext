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
    id: number
    name: string
    original_language: string
    original_name: string
    overview: string
    poster_path: string
    media_type: string
    genre_ids: number[]
    popularity: number
    first_air_date: string
    vote_average: number
    vote_count: number
    origin_country: string[]
  }
  export interface showBoxProp{
    item : Result
  }
  
const Showbox = ({item} : showBoxProp) => {
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

export default Showbox