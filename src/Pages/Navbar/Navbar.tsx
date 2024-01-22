
import React from 'react'
import { Link } from 'react-router-dom'


type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav style={{
      textAlign:"center",
    }}>
        <div className = "links" style={{
      }}>
        <div className='sections' style={{
          paddingTop:"15px",
        }}>
          <Link to="/" style = {{
            color:"white",
          }}>HOME</Link>
          <Link to="/teams" style = {{
            color:"white",
          }}>TEAM PROPS</Link>
          <Link to= "/players"style = {{
            color:"white",
          }}>PLAYER PROPS</Link>
          <a style = {{
            color:"white",
          }}href="#">PICKS</a>
          <button  style={{
          float:'right'
        }}>SIGN OUT!</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar