
import React from 'react'
import { Link } from 'react-router-dom'
import "./Navbar.css"

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav className="navbar" style={{
      textAlign:"center",
      backgroundColor:"black",
      paddingBottom:'10px',
      justifyContent:'center',
      alignItems:'center',
      display:'flex'
    }}>
        <div className = "nav-links" style={{
      }}>
          <Link to="/" style = {{
            color:"#52525b",
            textDecoration:'none',
            margin:'10px',
          }}>HOME</Link>
          <Link to="/recommended" style = {{
            color:"#52525b",
            textDecoration:'none',
            margin:'10px',
          }}>RECOMMENED</Link>
          <Link to= "/pool" style = {{
            color:"#52525b",
            textDecoration:'none',
            margin:'10px',
          }}>POOL</Link>
          <a style = {{
            color:"#52525b",
            textDecoration:'none',
            margin:'10px'
          }}href="#">PROFILE</a>

          <button className='sign-out-btn' style={{
          float:'right',
          
        }}>SIGN OUT!</button>

      </div>
    </nav>
  )
}

export default Navbar