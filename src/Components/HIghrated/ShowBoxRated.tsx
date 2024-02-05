import React from 'react'
import {MovieListResult} from "../../data/types/MovieListResponse";


interface showRatedProp {
    item : MovieListResult
}
const ShowBoxRated = ({item} : showRatedProp) => {
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

export default ShowBoxRated