import React, { createContext } from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './Pages/Home/HomePage';
import { Outlet } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { useSubscription } from "./lib/auth";
import { Session } from "@supabase/supabase-js";
export const CurrentUserContext = createContext<Session | null | undefined>(null);

const queryClient = new QueryClient()
function App() {
  const currentUser = useSubscription()
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Outlet/>
        </div>
      </QueryClientProvider>
    </CurrentUserContext.Provider>
  );
}

export default App;
