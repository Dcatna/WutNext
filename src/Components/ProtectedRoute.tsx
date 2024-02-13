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

    if(currentUserSession === null) {
        return <div>Loading..</div>
    }

    if(currentUserSession?.user == null) {
        return <Navigate to="/signin" replace/>
    }
    return <>{children}</>
  
}

export default ProtectedRoute