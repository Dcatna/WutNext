import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'


interface genres {
  [key:string] : number
}
//gonna prompt user with 5 or so shows/movies depending on what they are looking for then show recs, if they dont know any 
//of the shows just show them mix of popular and highest rated, and let them like movies and shows
async function fetchRecs(){
  const res = await fetch('/recommendations')
  return res 
}
const RecommendedScreen = () => {
  const [recommendations, setRecommendations] = useState()

  useEffect(() => {
    async function fetchRecs() {
      try {
        const response = await fetch('/recommendations');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data  = await response.json(); // Assuming the response is in the correct shape
        console.log(data)
        setRecommendations(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }

    fetchRecs();
  }, [])
  
  return (
    <div>
      <Navbar></Navbar>
      <p>rec</p>
    </div>
  )
}

export default RecommendedScreen