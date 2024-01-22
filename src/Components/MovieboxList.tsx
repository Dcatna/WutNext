import React, { useEffect, useState } from 'react'
import Moviebox, { Data } from './Moviebox'


export type MovieList = {
    items : Data[]
}

const Movieboxlist = ({items} : MovieList) => {
  return (
    <div>
        <ul>
        {items.map((item: Data) => (
                    <Moviebox 
                        title={item.title}
                        overview={item.overview}
                        release_date={item.release_date}
                        vote_average={item.vote_average}
                        poster_path={item.poster_path}
                    />
                ))}
        </ul>
    </div>
  )
}

export default Movieboxlist