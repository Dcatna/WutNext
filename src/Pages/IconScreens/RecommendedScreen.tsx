import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { CurrentUserContext } from '../../App'


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
  const currentUserSession = useContext(CurrentUserContext) 
  const userToken = currentUserSession?.access_token
  useEffect(() => {
    async function fetchRecs() {
      try {
        const response = await fetch('/recommendations', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data  = await response.json() // Assuming the response is in the correct shape
        console.log(data[0]['genre_ratings'])
        setRecommendations(data[0]['genre_ratings'])
      } catch (error) {
        console.log(error)
        console.error('There was a problem with the fetch operation:', error)
      }
    }

    fetchRecs();
  }, [])
  
  return (
    <div>
      <Navbar></Navbar>
      <p>{recommendations}</p>
    </div>
  )
}

export default RecommendedScreen