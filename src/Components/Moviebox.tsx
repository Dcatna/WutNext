import React from 'react'


export type Data = {
    title: string, 
    overview: string,
    release_date: string,
    vote_average: number,
    poster_path: string,
}

const Moviebox = ({title, overview, release_date, vote_average, poster_path}: Data) => {
    const partial_url = "https://image.tmdb.org/t/p/w500"
  return (
    <div>
        <div>
            <p>{title}</p>
            <img src={partial_url+poster_path} alt="" />
            <p>{overview}</p>
            <p>{vote_average}</p>
        </div>
    </div>
  )
}

export default Moviebox