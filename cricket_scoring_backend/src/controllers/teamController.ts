import Team from '../models/Team';
import { Request, Response } from 'express';

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const team = await Team.create({
      name,
      players: [],
      totalRuns: 0,
      wickets: 0,
      overs: 0,
      extras: {
        wide: 0,
        noball: 0,
        bye: 0,
        legbye: 0,
      },
    });

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create team', error: err });
  }
};
