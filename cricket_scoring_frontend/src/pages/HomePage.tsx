import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const navigate = useNavigate();

  const startMatch = async () => {
    try {
      const teamARes = await axios.post("http://localhost:5000/api/teams", { name: teamA });
      const teamBRes = await axios.post("http://localhost:5000/api/teams", { name: teamB });

      const matchRes = await axios.post("http://localhost:5000/api/matches", {
        teamA: teamARes.data._id,
        teamB: teamBRes.data._id,
      });

      navigate(`/scoring/${matchRes.data._id}`);
    } catch (err) {
      console.error("Error starting match", err);
      alert("Failed to start match.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Start New Match</h2>
      <input
        placeholder="Team A Name"
        value={teamA}
        onChange={(e) => setTeamA(e.target.value)}
        style={{ display: "block", marginBottom: "10px", padding: "8px", width: "200px" }}
      />
      <input
        placeholder="Team B Name"
        value={teamB}
        onChange={(e) => setTeamB(e.target.value)}
        style={{ display: "block", marginBottom: "10px", padding: "8px", width: "200px" }}
      />
      <button onClick={startMatch} style={{ padding: "8px 16px" }}>
        Start Match
      </button>
    </div>
  );
}

export default HomePage;
