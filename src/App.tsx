import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './Pages/Home/HomePage';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Outlet/>
    </div>
  );
}

export default App;
