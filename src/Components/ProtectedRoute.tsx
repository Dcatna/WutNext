import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { CurrentUserContext } from '../App';



const ProtectedRoute = ({children} : {children : ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const currentUserSession = useContext(CurrentUserContext)
    
    if(currentUserSession?.user == null) {
        return <Navigate to="/signin" replace/>
    }
    return <>{children}</>
  
}

export default ProtectedRoute