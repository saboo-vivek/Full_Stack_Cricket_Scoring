import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MatchScoring() {
  const { id: matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Scoring state
  const [currentBatsman, setCurrentBatsman] = useState('');
  const [currentBowler, setCurrentBowler] = useState('');
  const [deliveryType, setDeliveryType] = useState('normal');
  const [runs, setRuns] = useState(0);
  const [extras, setExtras] = useState(0);
  const [isWicket, setIsWicket] = useState(false);
  const [overNumber, setOverNumber] = useState(1);
  const [ballInOver, setBallInOver] = useState(1);
  const [message, setMessage] = useState('');
  
  // Team players
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  
  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const matchResponse = await axios.get(`/api/matches/${matchId}`);
        setMatch(matchResponse.data);
        
        // Fetch team players
        const teamAResponse = await axios.get(`/api/players?teamId=${matchResponse.data.teamA._id}`);
        const teamBResponse = await axios.get(`/api/players?teamId=${matchResponse.data.teamB._id}`);
        
        setTeamAPlayers(teamAResponse.data);
        setTeamBPlayers(teamBResponse.data);
        
        // Set default batsman and bowler if available
        if (teamAResponse.data.length > 0) {
          setCurrentBatsman(teamAResponse.data[0]._id);
        }
        
        if (teamBResponse.data.length > 0) {
          setCurrentBowler(teamBResponse.data[0]._id);
        }
        
        setLoading(false);
      } catch (error) {
        setError('Error fetching match details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMatchDetails();
  }, [matchId]);
  
  const handleDeliveryRecord = async () => {
    try {
      await axios.post('/api/deliveries', {
        matchId,
        batsmanId: currentBatsman,
        bowlerId: currentBowler,
        deliveryType,
        runs: parseInt(runs),
        extras: parseInt(extras),
        isWicket,
        overNumber: parseInt(overNumber),
        ballInOver: parseInt(ballInOver),
      });
      
      setMessage('Delivery recorded successfully');
      
      // Update ball in over
      if (deliveryType === 'normal' || deliveryType === 'wicket') {
        if (ballInOver === 6) {
          setOverNumber(overNumber + 1);
          setBallInOver(1);
        } else {
          setBallInOver(ballInOver + 1);
        }
      }
      
      // Reset values
      setRuns(0);
      setExtras(0);
      setIsWicket(false);
      setDeliveryType('normal');
      
      // Refresh match details
      const matchResponse = await axios.get(`/api/matches/${matchId}`);
      setMatch(matchResponse.data);
      
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!match) return <div className="error">Match not found</div>;
  
  return (
    <div className="match-scoring">
      <h2>Match Scoring</h2>
      <div className="match-details">
        <h3>{match.teamA.name} vs {match.teamB.name}</h3>
      </div>
      
      {message && <div className="message">{message}</div>}
      
      <div className="scoring-panel">
        <div className="scoring-controls">
          <div className="form-group">
            <label>Batsman:</label>
            <select 
              value={currentBatsman} 
              onChange={(e) => setCurrentBatsman(e.target.value)}
            >
              {teamAPlayers.map(player => (
                <option key={player._id} value={player._id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Bowler:</label>
            <select 
              value={currentBowler} 
              onChange={(e) => setCurrentBowler(e.target.value)}
            >
              {teamBPlayers.map(player => (
                <option key={player._id} value={player._id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Delivery Type:</label>
            <select 
              value={deliveryType} 
              onChange={(e) => setDeliveryType(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="wide">Wide</option>
              <option value="no-ball">No Ball</option>
              <option value="bye">Bye</option>
              <option value="leg-bye">Leg Bye</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Runs:</label>
            <div className="runs-buttons">
              {[0, 1, 2, 3, 4, 6].map(value => (
                <button 
                  key={value} 
                  type="button" 
                  className={`run-btn ${runs === value ? 'active' : ''}`}
                  onClick={() => setRuns(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Extras:</label>
            <input 
              type="number" 
              min="0" 
              value={extras} 
              onChange={(e) => setExtras(e.target.value)} 
            />
          </div>
          
          <div className="form-group checkbox">
            <label>
              <input 
                type="checkbox" 
                checked={isWicket} 
                onChange={(e) => setIsWicket(e.target.checked)} 
              />
              Wicket
            </label>
          </div>
          
          <div className="form-group">
            <label>Over:</label>
            <input 
              type="number" 
              min="1" 
              value={overNumber} 
              onChange={(e) => setOverNumber(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Ball in Over:</label>
            <input 
              type="number" 
              min="1" 
              max="6" 
              value={ballInOver} 
              onChange={(e) => setBallInOver(e.target.value)} 
            />
          </div>
          
          <button 
            className="record-btn" 
            onClick={handleDeliveryRecord}
          >
            Record Delivery
          </button>
        </div>
        
        <div className="match-stats">
          <h3>Match Statistics</h3>
          
          {match.innings && match.innings.map((inning, index) => (
            <div key={index} className="inning">
              <h4>Inning {index + 1}</h4>
              
              <div className="score-summary">
                <div className="total-score">
                  <span className="score">{inning.totalRuns}/{inning.wickets}</span>
                  <span className="overs">({inning.overs}.{inning.balls})</span>
                </div>
                <div className="run-rate">
                  RR: {(inning.totalRuns / (inning.overs + inning.balls/6)).toFixed(2)}
                </div>
              </div>
              
              <div className="batting-card">
                <h5>Batting</h5>
                <table>
                  <thead>
                    <tr>
                      <th>Batsman</th>
                      <th>R</th>
                      <th>B</th>
                      <th>4s</th>
                      <th>6s</th>
                      <th>SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inning.battingScorecard && inning.battingScorecard.map((batsman, idx) => (
                      <tr key={idx}>
                        <td>{batsman.playerName}</td>
                        <td>{batsman.runs}</td>
                        <td>{batsman.balls}</td>
                        <td>{batsman.fours}</td>
                        <td>{batsman.sixes}</td>
                        <td>{batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(2) : 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bowling-card">
                <h5>Bowling</h5>
                <table>
                  <thead>
                    <tr>
                      <th>Bowler</th>
                      <th>O</th>
                      <th>M</th>
                      <th>R</th>
                      <th>W</th>
                      <th>Econ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inning.bowlingScorecard && inning.bowlingScorecard.map((bowler, idx) => (
                      <tr key={idx}>
                        <td>{bowler.playerName}</td>
                        <td>{Math.floor(bowler.balls / 6)}.{bowler.balls % 6}</td>
                        <td>{bowler.maidens}</td>
                        <td>{bowler.runs}</td>
                        <td>{bowler.wickets}</td>
                        <td>{bowler.balls > 0 ? ((bowler.runs / (bowler.balls / 6))).toFixed(2) : 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MatchScoring;
