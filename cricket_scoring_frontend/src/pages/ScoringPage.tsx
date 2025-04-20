import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Extras {
  wide: number;
  noball: number;
  bye: number;
  legbye: number;
  overthrow: number;
}

function ScoringPage() {
  const { matchId } = useParams();
  const [players, setPlayers] = useState<any[]>([]);
  const [batsman, setBatsman] = useState("");
  const [bowler, setBowler] = useState("");
  const [runs, setRuns] = useState(0);
  const [deliveryType, setDeliveryType] = useState("normal");
  const [extras, setExtras] = useState<Extras>({
    wide: 0,
    noball: 0,
    bye: 0,
    legbye: 0,
    overthrow: 0,
  });
  const [isWicket, setIsWicket] = useState(false);
  const [match, setMatch] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);

  useEffect(() => {
    fetchMatchAndPlayers();
  }, []);

  const fetchMatchAndPlayers = async () => {
    try {
      const matchRes = await axios.get(`http://localhost:5000/api/matches/${matchId}`);
      setMatch(matchRes.data);

      const battingTeamId = matchRes.data.currentInnings === 1
        ? matchRes.data.teamA
        : matchRes.data.teamB;

      const teamRes = await axios.get(`http://localhost:5000/api/teams/${battingTeamId}`);
      setTeam(teamRes.data);

      const teamAPlayers = await axios.get(`http://localhost:5000/api/teams/${matchRes.data.teamA}/players`);
      const teamBPlayers = await axios.get(`http://localhost:5000/api/teams/${matchRes.data.teamB}/players`);

      setPlayers([...teamAPlayers.data, ...teamBPlayers.data]);
    } catch (err) {
      console.error("Error fetching match/players", err);
    }
  };

  const submitDelivery = async () => {
    if (!batsman || !bowler) {
      alert("Please select both batsman and bowler.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/deliveries", {
        matchId,
        batsman,
        bowler,
        deliveryType,
        runs,
        extras,
        isWicket,
        overNumber: 0,
        ballInOver: 0,
      });

      alert("Delivery recorded");

      // Reset fields
      setRuns(0);
      setExtras({ wide: 0, noball: 0, bye: 0, legbye: 0, overthrow: 0 });
      setIsWicket(false);
      setDeliveryType("normal");

      // Refresh scoreboard
      fetchMatchAndPlayers();
    } catch (err) {
      console.error("Error recording delivery", err);
      alert("Failed to record delivery.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Scoring Panel</h2>

      {match && team && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Live Scoreboard</h3>
          <p>
            <strong>{team.name}</strong> — {team.totalRuns}/{team.wickets} in {team.overs} overs
          </p>
          <p>
            Extras: Wide {team.extras?.wide}, NoBall {team.extras?.noball},
            Bye {team.extras?.bye}, LegBye {team.extras?.legbye}
          </p>
        </div>
      )}

      <div style={{ marginBottom: "10px" }}>
        <label>Batsman: </label>
        <select value={batsman} onChange={(e) => setBatsman(e.target.value)}>
          <option value="">Select Batsman</option>
          {players.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Bowler: </label>
        <select value={bowler} onChange={(e) => setBowler(e.target.value)}>
          <option value="">Select Bowler</option>
          {players.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Runs: </label>
        <input
          type="number"
          value={runs}
          onChange={(e) => setRuns(Number(e.target.value))}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Delivery Type: </label>
        <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="normal+overthrow">Normal + Overthrow</option>
          <option value="noball">No Ball</option>
          <option value="wide">Wide</option>
          <option value="bye">Bye</option>
          <option value="legbye">Leg Bye</option>
          <option value="noball+bye+overthrow">No Ball + Bye + OT</option>
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Extras:</label><br />
        <input
          placeholder="Wide"
          type="number"
          value={extras.wide}
          onChange={(e) => setExtras({ ...extras, wide: Number(e.target.value) })}
        />
        <input
          placeholder="No Ball"
          type="number"
          value={extras.noball}
          onChange={(e) => setExtras({ ...extras, noball: Number(e.target.value) })}
        />
        <input
          placeholder="Bye"
          type="number"
          value={extras.bye}
          onChange={(e) => setExtras({ ...extras, bye: Number(e.target.value) })}
        />
        <input
          placeholder="Leg Bye"
          type="number"
          value={extras.legbye}
          onChange={(e) => setExtras({ ...extras, legbye: Number(e.target.value) })}
        />
        <input
          placeholder="Overthrow"
          type="number"
          value={extras.overthrow}
          onChange={(e) => setExtras({ ...extras, overthrow: Number(e.target.value) })}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Wicket?</label>
        <input
          type="checkbox"
          checked={isWicket}
          onChange={(e) => setIsWicket(e.target.checked)}
        />
      </div>

      <button onClick={submitDelivery}>Submit Delivery</button>
    </div>
  );
}

export default ScoringPage;
