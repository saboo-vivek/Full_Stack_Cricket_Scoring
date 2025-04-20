// src/models/Player.ts

import mongoose from 'mongoose';
import { PlayerStats } from '../types/cricketTypes';

const playerSchema = new mongoose.Schema({
  name: String,
  role: String, // "batsman" | "bowler" | "allrounder"
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  battingStats: {
    runs: Number,
    balls: Number,
    fours: Number,
    sixes: Number,
    isOut: Boolean,
  },
  bowlingStats: {
    wickets: Number,
    overs: Number,
    maidens: Number,
    runsConceded: Number,
  },
});

export default mongoose.model('Player', playerSchema);
