import { Request, Response } from 'express';
import Player from '../models/Player';
import Team from '../models/Team';

export const createPlayer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, role, teamName } = req.body;
    const team = await Team.findOne({ name: teamName });
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;      // ← return nothing (void), not the result of res.json()
    }

    const player = await Player.create({
      name,
      role,
      teamId: team._id,
      battingStats: { runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      bowlingStats: { wickets: 0, overs: 0, maidens: 0, runsConceded: 0 },
    });

    team.players.push(player._id);
    await team.save();
    
    res.status(201).json(player);  // just call res.json, don’t return it
  } catch (err) {
    res.status(500).json({ message: 'Failed to create player', error: err });
  }
};
