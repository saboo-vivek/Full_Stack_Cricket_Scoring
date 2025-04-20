import React, { useState } from 'react';
import axios from 'axios';

function CreateTeam() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/teams', { name });
      setMessage(`Team "${name}" created successfully!`);
      setName('');
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Team</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Team Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="submit-btn">Create Team</button>
      </form>
    </div>
  );
}

export default CreateTeam;