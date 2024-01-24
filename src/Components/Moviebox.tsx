import React from 'react'

export type Data = {
    title: string | undefined, 
    overview: string | undefined,
    release_date: string | undefined,
    vote_average: number | undefined,
    poster_path: string | undefined,
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
const Moviebox = ({overview, release_date, vote_average, poster_path}: Data) => {
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
            <img src={partial_url+poster_path} alt="" />
            <p>{shortenedDesc(overview)}</p>
            <p>{vote_average}</p>
        </div>
    </div>
  )
}

export default Moviebox