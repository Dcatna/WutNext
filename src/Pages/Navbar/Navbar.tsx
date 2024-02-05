
import React from 'react'
import { Link } from 'react-router-dom'
import {Button} from "../../Components/Button";

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav>
        <div className="w-screen flex justify-center items-center">
            <Button asChild variant="ghost">
                <Link to="/">Home</Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-md">
                <Link to="/recommended">Recommended</Link>
            </Button>
            <Button  asChild variant="ghost" className="rounded-md">
                <Link to= "/pool">Pool</Link>
            </Button>
            <Button variant="ghost" className="rounded-md">
                Profile
            </Button>
            <Button  variant="ghost" className="rounded-md">
                Sign Out
            </Button>
        </div>
    </nav>
  )
}

export default Navbar