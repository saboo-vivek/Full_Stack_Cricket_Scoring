// src/models/Delivery.ts

import mongoose from 'mongoose';
import { DeliveryType } from '../types/cricketTypes';

const deliverySchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  batsmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  bowlerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  runs: Number,
  deliveryType: String, // e.g. wide, no-ball, etc.
  extras: {
    wide: Number,
    noball: Number,
    bye: Number,
    legbye: Number,
    overthrow: Number,
  },
  isWicket: Boolean,
  overNumber: Number,
  ballInOver: Number,
});

export default mongoose.model('Delivery', deliverySchema);
