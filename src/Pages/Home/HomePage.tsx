import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Moviebox, { Result, Root } from '../../Components/Moviebox'
import Movieboxlist from '../../Components/MovieboxList'
import "./HomePage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartSimple, faFire, faChildReaching, faBorderAll,faGripLines} from '@fortawesome/free-solid-svg-icons'
import Showboxlist from '../../Components/ShowboxList'
import ShowboxList from '../../Components/ShowboxList'
import TrendingScreen from '../IconScreens/TrendingScreen'
import PopularScreen from '../IconScreens/PopularScreen'
import RecommendedScreen from '../IconScreens/RecommendedScreen'
import ProtectedRoute from '../../Components/ProtectedRoute'
import MovieboxScroll from '../../Components/Scrollables/MovieBoxScroll'


const HomePage = () => {
    const [screenTrending, setScreenTrending] = useState(true)
    const [screenPopular, setScreenPopular] = useState(false)
    //const [screenRecommended, setScreenRecommended] = useState(false)
    function setScreen(screenNumber : number){
      if(screenNumber === 1) {
        setScreenTrending(true)
        setScreenPopular(false)
       // setScreenRecommended(false)
      }
      else if(screenNumber === 2) {
        setScreenTrending(false)
        setScreenPopular(true)
       // setScreenRecommended(false)
      }
      else {
        setScreenTrending(false)
        setScreenPopular(false)
        //setScreenRecommended(true)
      }
    }
   return (
    <div>
        <Navbar/>
        <div className='icons-container'>
          <ul className='ul-icons'>
            <li onClick={() => setScreen(1)} className='icons'><FontAwesomeIcon className = "icon" icon ={faGripLines} /></li>
            <li onClick={() => setScreen(2)} className='icons'><FontAwesomeIcon className = "icon" icon = {faBorderAll} /></li>
  
          </ul>
        </div>
        {screenTrending && <TrendingScreen />}
            {screenPopular && <MovieboxScroll />}
            
    </div>
  )
}

export default HomePage