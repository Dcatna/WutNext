import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { CurrentUserContext } from '../App';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const currentUserSession = useContext(CurrentUserContext);

  useEffect(() => {
    const checkAuthState = async () => {
      if (currentUserSession?.user) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    checkAuthState();
  }, [currentUserSession]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUserSession?.user) {
    // User is not authenticated
    return <Navigate to="/signin" replace />;
  }

  // User is authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
