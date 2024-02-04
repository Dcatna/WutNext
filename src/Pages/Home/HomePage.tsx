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
    const [screenGrid, setScreenGrid] = useState(true)
    const [screenRows, setScreenRows] = useState(false)
    //const [screenRecommended, setScreenRecommended] = useState(false)
    function setScreen(screenNumber : number){
      if(screenNumber === 1) {
        setScreenGrid(true)
        setScreenRows(false)
       // setScreenRecommended(false)
      }
      else if(screenNumber === 2) {
        setScreenGrid(false)
        setScreenRows(true)
       // setScreenRecommended(false)
      }
      else {
        setScreenGrid(false)
        setScreenRows(false)
        //setScreenRecommended(true)
      }
    }
   return (
    <div>
        <Navbar/>
        <div className='icons-container'>
          <ul className='ul-icons'>
            <li onClick={() => setScreen(1)} className='icons'><FontAwesomeIcon className = "icon" icon = {faBorderAll} /></li>
            <li onClick={() => setScreen(2)} className='icons'><FontAwesomeIcon className = "icon" icon = {faGripLines}/></li>
  
          </ul>
        </div>
        {screenGrid && <MovieboxScroll />}
        {screenRows && <TrendingScreen />}
            
            
    </div>
  )
}

export default HomePage