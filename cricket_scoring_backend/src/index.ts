import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import matchRoutes from './routes/matchRoutes';
import teamRoutes from './routes/teamRoutes';
import playerRoutes from './routes/playerRoutes';
import deliveryRoutes from './routes/deliveryRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Cricket Scoring API is running...');
});

app.use('/api/matches', matchRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/deliveries', deliveryRoutes);


mongoose
  .connect(process.env.MONGO_URI || '', { dbName: 'cricketDB' })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
