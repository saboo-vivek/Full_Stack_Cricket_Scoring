import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateMatch() {
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/api/teams');
        setTeams(response.data);
        if (response.data.length >= 2) {
          setTeamAId(response.data[0]._id);
          setTeamBId(response.data[1]._id);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (teamAId === teamBId) {
      setMessage('Error: Both teams cannot be the same');
      return;
    }
    
    try {
      const response = await axios.post('/api/matches', { teamAId, teamBId });
      setMessage('Match created successfully!');
      navigate(`/match/${response.data._id}`);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Match</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Team A:</label>
          <select 
            value={teamAId} 
            onChange={(e) => setTeamAId(e.target.value)}
            required
          >
            {teams.map(team => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Team B:</label>
          <select 
            value={teamBId} 
            onChange={(e) => setTeamBId(e.target.value)}
            required
          >
            {teams.map(team => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        
        <button type="submit" className="submit-btn">Create Match</button>
      </form>
    </div>
  );
}

export default CreateMatch;
