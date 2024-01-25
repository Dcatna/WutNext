import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Moviebox, { Result, Root } from '../../Components/Moviebox'
import Movieboxlist from '../../Components/MovieboxList'
import "./HomePage.css"

const HomePage = () => {
    const [backdata, setBackData] = useState<Result[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any | null>(null)

    useEffect(() => {
        fetch("/trending").then(res => 
          res.json() 
        ).then((data) =>{
            //console.log(data)
          setBackData((data as Root).results);
          console.log((data as Root).results)
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