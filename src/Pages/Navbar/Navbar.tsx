
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {Button} from "../../Components/Button";
import { faBorderAll,faGripLines, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from '../../lib/supabaseClient';
import { CurrentUserContext } from '../../App';

type Props = {}

const Navbar = (props: Props) => {
    let navigate = useNavigate();
    const client = useContext(CurrentUserContext)
    async function signOut() {
        if(client?.access_token){
            try {
                const { error } = await supabase.auth.signOut();
                
                if (error) {
                    console.log('Error signing out:', error);
                } else {
                    console.log('Sign out successful');
                    
                    navigate('/')
                    window.location.reload();
                }
            } catch (error) {
                console.error('Sign out failed:', error);
            }
        }
        

    }

  return (
    <nav>
        <div className="w-screen flex justify-center items-center">
            <Button asChild variant="ghost">
                <Link to="/home">Home</Link>
            </Button>
            <Button asChild variant="ghost">
                <Link to="/browse">Browse</Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-md">
                <Link to="/recommended">Recommended</Link>
            </Button>
            <Button  asChild variant="ghost" className="rounded-md">
                <Link to= "/pool">Pool</Link>
            </Button>
            <Button variant="ghost" className="rounded-md">
                <Link to = "/profile">Profile</Link>
            </Button>
            <Button onClick={signOut} variant="ghost" className="rounded-md">
                Sign Out
            </Button>
            <Link to={"/search"}><FontAwesomeIcon icon = {faMagnifyingGlass} /></Link>
        </div>
    </nav>
  )
}

export default Navbar