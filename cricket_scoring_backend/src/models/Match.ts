// src/models/Match.ts

import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  currentInnings: Number, // 1 or 2
  currentOver: Number,
  currentBall: Number,
  isCompleted: Boolean,
  date: { type: Date, default: Date.now },
});

export default mongoose.model('Match', matchSchema);
