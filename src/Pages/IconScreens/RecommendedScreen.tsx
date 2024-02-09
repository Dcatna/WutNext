import React from 'react'
import Navbar from '../Navbar/Navbar'

type Props = {}
//gonna prompt user with 5 or so shows/movies depending on what they are looking for then show recs, if they dont know any 
//of the shows just show them mix of popular and highest rated, and let them like movies and shows
const RecommendedScreen = (props: Props) => {
  return (
    <div>
      <Navbar></Navbar>
    </div>
  )
}

export default RecommendedScreen