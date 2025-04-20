import Match from '../models/Match';
import Team from '../models/Team';
import { Request, Response } from 'express';

export const createMatch = async (req: Request, res: Response) => {
  try {
    const { teamA, teamB } = req.body;

    const match = await Match.create({
      teamA,
      teamB,
      currentInnings: 1,
      currentOver: 0,
      currentBall: 0,
      isCompleted: false,
    });

    res.status(201).json(match);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create match', error: err });
  }
};

export const getMatch = async (req: Request, res: Response) => {
  try {
    const match = await Match.findById(req.params.id).populate('teamA teamB');
    res.json(match);
  } catch (err) {
    res.status(404).json({ message: 'Match not found', error: err });
  }
};
