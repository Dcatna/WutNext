import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './Pages/Home/HomePage';
import { Outlet } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Outlet/>
      </div>
    </QueryClientProvider>
  );
}

export default App;
