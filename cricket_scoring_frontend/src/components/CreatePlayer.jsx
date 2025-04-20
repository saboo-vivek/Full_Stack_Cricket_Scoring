import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreatePlayer() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('batsman');
  const [teamName, setTeamName] = useState('');
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/api/teams');
        setTeams(response.data);
        if (response.data.length > 0) {
          setTeamName(response.data[0].name);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/players', { name, role, teamName });
      setMessage(`Player "${name}" created successfully!`);
      setName('');
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Player</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Player Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="batsman">Batsman</option>
            <option value="bowler">Bowler</option>
            <option value="all-rounder">All-rounder</option>
            <option value="wicket-keeper">Wicket-keeper</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Team:</label>
          <select 
            value={teamName} 
            onChange={(e) => setTeamName(e.target.value)}
            required
          >
            {teams.map(team => (
              <option key={team._id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        
        <button type="submit" className="submit-btn">Create Player</button>
      </form>
    </div>
  );
}

export default CreatePlayer;