import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('/api/matches');
        setMatches(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching matches. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="match-list">
      <h2>Matches</h2>
      {matches.length === 0 ? (
        <p>No matches available. Create a new match!</p>
      ) : (
        <div className="matches">
          {matches.map(match => (
            <div key={match._id} className="match-card">
              <div className="match-teams">
                <span>{match.teamA.name}</span> vs <span>{match.teamB.name}</span>
              </div>
              <div className="match-date">
                {new Date(match.createdAt).toLocaleDateString()}
              </div>
              <Link to={`/match/${match._id}`} className="view-btn">
                View/Score
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchList;