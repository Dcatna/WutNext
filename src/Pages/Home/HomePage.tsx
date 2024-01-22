import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Moviebox, { Data } from '../../Components/Moviebox'
import Movieboxlist from '../../Components/MovieboxList'

interface ApiResponse {
    adult:boolean,
    backdrop_path:string,
    id:string,
    title:string,
    original_language:string,
    original_title: string,
    overview: string,
    poster_path: string,
    media_type: string,
    genra_ids: Array<number>,
    popularity: number,
    release_date: string,
    video: boolean,
    vote_average:number,
    vote_count:number,

}
const HomePage = () => {
    const [backdata, setBackData] = useState<Data[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any | null>(null)

    useEffect(() => {
        fetch("/trending").then(res => 
          res.json()
        ).then((data) =>{
            console.log(data)
          setBackData(data.results);
          setLoading(false)
        }).catch(error => {
          setError(error);
          setLoading(false);
        })
      }, [])
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>

  return (
    <div>
        <Navbar/>
        {backdata?.length ? <Movieboxlist items={backdata}></Movieboxlist> : <p>No data available</p>}
    </div>
  )
}

export default HomePage