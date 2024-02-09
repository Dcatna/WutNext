import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBorderAll,faGripLines} from '@fortawesome/free-solid-svg-icons'
import TrendingScreen from '../IconScreens/TrendingScreen'
import MovieboxScroll from '../../Components/Scrollables/MovieBoxScroll'
import ShowBoxScroll from '../../Components/Scrollables/ShowBoxScroll'

type Screen = "GRID" | "ROW"

const HomePage = () => {
    const [screen, setScreen] = useState<Screen>("GRID")

   return (
    <body className='overflow-x-hidden'>
      
    
    <div className="min-h-screen w-screen ">
        <div className='mb-5'>
            <Navbar />
        </div>
        <div>
          <ul className='flex items-center justify-center'>
            <li onClick={() => setScreen("GRID")}><FontAwesomeIcon icon = {faBorderAll} /></li>
            <li onClick={() => setScreen("ROW")}><FontAwesomeIcon icon = {faGripLines}/></li>
          </ul>
        </div>
        <div>
            {screen === "GRID" && <MovieboxScroll />}
            {screen === "ROW" && <ShowBoxScroll />}
        </div>
    </div>
    </body>
  )
}

export default HomePage