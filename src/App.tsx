import React, { createContext } from 'react';
import logo from './logo.svg';
import HomePage from './Pages/Home/HomePage';
import { Outlet } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { useSubscription } from "./lib/auth";
import { Session } from "@supabase/supabase-js";
import TMDBClient from "./data/TMDBClient";
import TMDBCClient from "./data/TMDBClient";
import Navbar from './Pages/Navbar/Navbar';
import UserLibrary from './Pages/UserLibrary';

const tmdbClient = new TMDBClient()
const queryClient = new QueryClient()


export const TMDBClientContext = createContext<TMDBCClient>(tmdbClient);
export const CurrentUserContext = createContext<Session | null | undefined>(null);

function App() {
  const currentUser = useSubscription()
  return (
      <div className="h-full w-full bg-background">
        <CurrentUserContext.Provider value={currentUser}>
            <TMDBClientContext.Provider value={tmdbClient}>
              <QueryClientProvider client={queryClient}>
                <div className='overflow-x-hidden'>
                <Navbar></Navbar>
                <Outlet/>
                </div>
              </QueryClientProvider>
            </TMDBClientContext.Provider>
        </CurrentUserContext.Provider>
      </div>
  );
}

export default App;
