import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBorderAll,faGripLines} from '@fortawesome/free-solid-svg-icons'
import TrendingScreen from '../IconScreens/TrendingScreen'
import MovieboxScroll from '../../Components/Scrollables/MovieBoxScroll'

type Screen = "GRID" | "ROW"

const HomePage = () => {
    const [screen, setScreen] = useState<Screen>("GRID")

   return (
    <div className="min-h-screen w-screen">
        <div >
            <Navbar />
        </div>
        <div>
          <ul>
            <li onClick={() => setScreen("GRID")}><FontAwesomeIcon icon = {faBorderAll} /></li>
            <li onClick={() => setScreen("ROW")}><FontAwesomeIcon icon = {faGripLines}/></li>
          </ul>
        </div>
        {screen === "GRID" && <MovieboxScroll />}
        {screen === "ROW" && <TrendingScreen />}
    </div>
  )
}

export default HomePage