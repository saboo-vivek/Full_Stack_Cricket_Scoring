import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateMatch from './components/CreateMatch';
import CreateTeam from './components/CreateTeam';
import CreatePlayer from './components/CreatePlayer';
import MatchScoring from './components/MatchScoring';
import MatchList from './components/MatchList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="nav-menu">
          <h1>Cricket Scorer</h1>
          <ul>
            <li><Link to="/">Matches</Link></li>
            <li><Link to="/create-match">Create Match</Link></li>
            <li><Link to="/create-team">Create Team</Link></li>
            <li><Link to="/create-player">Create Player</Link></li>
          </ul>
        </nav>
        
        <div className="content">
          <Routes>
            <Route path="/" element={<MatchList />} />
            <Route path="/create-match" element={<CreateMatch />} />
            <Route path="/create-team" element={<CreateTeam />} />
            <Route path="/create-player" element={<CreatePlayer />} />
            <Route path="/match/:id" element={<MatchScoring />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;