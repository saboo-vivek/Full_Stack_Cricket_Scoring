// src/models/Team.ts

import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: String,
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  totalRuns: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  extras: {
    wide: Number,
    noball: Number,
    bye: Number,
    legbye: Number,
  },
  overs: Number,
});

export default mongoose.model('Team', teamSchema);
