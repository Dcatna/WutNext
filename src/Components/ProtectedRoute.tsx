import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { CurrentUserContext } from '../App';
import { Session } from '@supabase/supabase-js';



const ProtectedRoute = ({children} : {children : ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [session, setSession] = useState<Session | null>()
    const [loading, setLoading] = useState(true)
    const currentUserSession = useContext(CurrentUserContext)
    console.log('hi')
    useEffect(() => {
        // Assuming you have a method to check the session more directly, e.g., check current session state.
        // If such a method does not exist, you might need to ensure currentUserSession is populated correctly on app initialization.
        const sessionCheck = async () => {
            const session = await supabase.auth.getSession();
            setLoading(false); // Set loading to false after checking session.
            if (!session) {
                // Handle case where no session is found.
            }
        };
        sessionCheck();
    }, [currentUserSession]);
    if(loading && currentUserSession === null) {
        return <div>Loading..</div>
    }

    if(currentUserSession?.user == null) {
        return <Navigate to="/signin" replace/>
    }
    return <>{children}</>
  
}

export default ProtectedRoute