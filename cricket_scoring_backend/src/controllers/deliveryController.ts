// src/controllers/deliveryController.ts


import { Request, Response } from "express";
import Delivery from "../models/Delivery";
import Player from "../models/Player";
import Team from "../models/Team";
import Match from "../models/Match";

export const recordDelivery = async (req: Request, res: Response) => {
  try {
    const {
      matchId,
      batsmanId,
      bowlerId,
      deliveryType,
      runs,
      extras,
      isWicket,
      overNumber,
      ballInOver,
    } = req.body;

    // Create delivery record
    const delivery = await Delivery.create({
      matchId,
      batsmanId,
      bowlerId,
      deliveryType,
      runs,
      extras,
      isWicket,
      overNumber,
      ballInOver,
    });

    // Find batsman and bowler
    const batsmanDoc = await Player.findById(batsmanId);
    const bowlerDoc = await Player.findById(bowlerId);

    if (!batsmanDoc || !bowlerDoc) {
      throw new Error("Batsman or bowler not found");
    }

    // Initialize batsman stats if they don't exist
    if (!batsmanDoc.battingStats) {
      batsmanDoc.battingStats = {
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
      };
    } else {
      // Ensure all fields exist
      batsmanDoc.battingStats.runs ??= 0;
      batsmanDoc.battingStats.balls ??= 0;
      batsmanDoc.battingStats.fours ??= 0;
      batsmanDoc.battingStats.sixes ??= 0;
      batsmanDoc.battingStats.isOut ??= false;
    }

    // Initialize bowler stats if they don't exist
    if (!bowlerDoc.bowlingStats) {
      bowlerDoc.bowlingStats = {
        wickets: 0,
        overs: 0,
        maidens: 0,
        runsConceded: 0,
      };
    } else {
      // Ensure all fields exist
      bowlerDoc.bowlingStats.overs ??= 0;
      bowlerDoc.bowlingStats.wickets ??= 0;
      bowlerDoc.bowlingStats.maidens ??= 0;
      bowlerDoc.bowlingStats.runsConceded ??= 0;
    }

    let battingStats = batsmanDoc.battingStats;
    let bowlingStats = bowlerDoc.bowlingStats;

    // Determine if it's a legal ball for over counting
    const legalBall =
      !deliveryType.includes("noball") && !deliveryType.includes("wide");

    // Calculate total extra runs
    

    const totalExtras = (extras.wide || 0) + (extras.noball || 0) + (extras.bye || 0) + 
    (extras.legbye || 0) + (extras.overthrow || 0);

    // Handle different delivery types
    switch (true) {
      // Case 1: Wide + runs
      case deliveryType.includes("wide"):
        // No balls increase for batsman
        // 1 run + any additional runs conceded to bowler
        if (bowlingStats.runsConceded) bowlingStats.runsConceded += totalExtras;
        // All runs added to wide extras, no runs credited to batsman
        break;

      // Case 2: No-ball + bye
      case deliveryType === "noball+bye":
        // Batsman balls increase
        if (battingStats.balls) battingStats.balls += 1;
        // 1 run conceded to bowler plus byes
        bowlingStats.runsConceded += 1 + (extras.bye || 0);
        // No runs credited to batsman
        break;

      // Case 3: No-ball + runs
      case deliveryType === "noball":
        // Batsman balls increase
        if (battingStats.balls) battingStats.balls += 1;
        // All runs conceded to bowler
        if (bowlingStats.runsConceded) bowlingStats.runsConceded += totalExtras;
        // Runs (except 1) credited to batsman
        if (runs > 0) {
          battingStats.runs += runs;

          // Handle boundaries
          if (runs === 4)
            battingStats.fours =
              battingStats.fours === undefined || battingStats.fours === null
                ? 1
                : battingStats.fours + 1;
          if (runs === 6)
            battingStats.sixes =
              battingStats.sixes === undefined || battingStats.sixes === null
                ? 1
                : battingStats.sixes + 1;
        }
        break;

      // Case 4: No-ball + legbye
      case deliveryType === "noball+legbye":
        // Batsman balls increase

        
        if (battingStats.balls === undefined || battingStats.balls === null) 
                  battingStats.balls = 1;
                 else 
                  battingStats.balls += 1;
                





        // All runs conceded to bowler
        bowlingStats.runsConceded += 1 + (extras.legbye || 0);
        // No runs credited to batsman
        break;

      // Case 5: Legbye/Bye + Overthrow
      case deliveryType === "bye+overthrow" ||
        deliveryType === "legbye+overthrow":
        // Counted as ball faced
        if (battingStats.balls === undefined || battingStats.balls === null) {
                  battingStats.balls = 1;
                } else {
                  battingStats.balls += 1;
                }
        // No runs credited to batsman, all goes to extras
        break;

      // Case 6: Runs + Overthrow
      case deliveryType === "normal+overthrow":
        // Counted as ball faced
        if (battingStats.balls === undefined || battingStats.balls === null) {
                  battingStats.balls = 1;
                } else {
                  battingStats.balls += 1;
                }
        // All runs credited to batsman
        battingStats.runs += runs + (extras.overthrow || 0);

        // Handle boundaries in total runs
        const totalRuns = runs + (extras.overthrow || 0);
        if (runs === 4)
          battingStats.fours =
            battingStats.fours === undefined || battingStats.fours === null
              ? 1
              : battingStats.fours + 1;
        if (runs === 6)
          battingStats.sixes =
            battingStats.sixes === undefined || battingStats.sixes === null
              ? 1
              : battingStats.sixes + 1;

        // All runs conceded to bowler
        bowlingStats.runsConceded += runs + (extras.overthrow || 0);
        break;

      // Regular bye or legbye
      case deliveryType === "bye" || deliveryType === "legbye":
        // Counted as ball faced
        if (battingStats.balls === undefined || battingStats.balls === null) 
                  battingStats.balls = 1;
                 else 
                  battingStats.balls += 1;
                
        // All runs go to extras, none to batsman
        // Runs conceded to bowler
        if(!bowlingStats.runsConceded)
          bowlingStats.runsConceded=0
        else
        bowlingStats.runsConceded += totalExtras;
        break;

      // Normal delivery
      case deliveryType === "normal":
        // Counted as ball faced
        if (battingStats.balls === undefined || battingStats.balls === null) 
                  battingStats.balls = 1;
                 else 
                  battingStats.balls += 1;
        // Runs credited to batsman
        battingStats.runs += runs;

        // Handle boundaries
        if (runs === 4)
          battingStats.fours =
            battingStats.fours === undefined || battingStats.fours === null
              ? 1
              : battingStats.fours + 1;
        if (runs === 6)
          battingStats.sixes =
            battingStats.sixes === undefined || battingStats.sixes === null
              ? 1
              : battingStats.sixes + 1;

        // Runs conceded to bowler
        bowlingStats.runsConceded += runs;
        break;

      default:
        // Handle any other cases
        console.log(`Unhandled delivery type: ${deliveryType}`);
        break;
    }

    // Handle wicket
    if (isWicket) {
      if (!bowlingStats.wickets) bowlingStats.wickets = 1;
      else bowlingStats.wickets += 1;

      battingStats.isOut = true;
    }

    // Update overs for bowler if it's a legal ball
    if (legalBall) {
      // Convert current overs to fraction form
      const currentOvers = bowlingStats.overs || 0;
      const fullOvers = Math.floor(currentOvers);
      const balls = (currentOvers - fullOvers) * 10 + 1; // Add current ball

      if (balls >= 6) {
        // Complete over
        bowlingStats.overs = fullOvers + 1;
      } else {
        // Partial over
        bowlingStats.overs = fullOvers + balls / 10;
      }
    }

    // Save batsman and bowler updates
    await batsmanDoc.save();
    await bowlerDoc.save();

    // Find and update match and team data
    const match = await Match.findById(matchId);
    if (!match) throw new Error("Match not found");

    const battingTeamId = String(
      match.currentInnings === 1 ? match.teamA : match.teamB
    );

    const team = await Team.findById(battingTeamId);
    if (!team) throw new Error("Team not found");

    // Initialize team extras if needed
    team.extras = team.extras || { wide: 0, noball: 0, bye: 0, legbye: 0 };

    // Update team extras
    team.extras.wide += extras.wide || 0;
    team.extras.noball += extras.noball || 0;
    team.extras.bye += extras.bye || 0;
    team.extras.legbye += extras.legbye || 0;

    // Update total runs for team
    team.totalRuns = (team.totalRuns || 0) + runs + totalExtras;

    // Update wickets if applicable
    if (isWicket) {
      team.wickets = (team.wickets || 0) + 1;
    }

    // Update team overs if it's a legal ball
    if (legalBall) {
      const teamOvers = team.overs || 0;
      const fullOvers = Math.floor(teamOvers);
      const balls = Math.round((teamOvers - fullOvers) * 10) + 1;

      if (balls >= 6) {
        team.overs = fullOvers + 1;
      } else {
        team.overs = fullOvers + balls / 10;
      }
      team.overs = Number(team.overs.toFixed(1)); // Format for consistency
    }

    await team.save();

    res
      .status(201)
      .json({ message: "Delivery recorded and stats updated", delivery });
  } catch (err: any) {
    console.error("Error recording delivery:", err);
    res
      .status(500)
      .json({ message: "Failed to process delivery", error: err.message });
  }
};




// src/controllers/deliveryController.ts

// import { Request, Response } from "express";
// import Delivery from "../models/Delivery";
// import Player from "../models/Player";
// import Team from "../models/Team";
// import Match from "../models/Match";

// export const recordDelivery = async (req: Request, res: Response) => {
//   try {
//     const {
//       matchId,
//       batsmanId,
//       bowlerId,
//       deliveryType,
//       runs,
//       extras,
//       isWicket,
//       overNumber,
//       ballInOver,
//     } = req.body;

//     const delivery = await Delivery.create({
//       matchId,
//       batsmanId,
//       bowlerId,
//       deliveryType,
//       runs,
//       extras,
//       isWicket,
//       overNumber,
//       ballInOver,
//     });

//     const batsmanDoc = await Player.findById(batsmanId);
//     console.log("batsmanDoc = ", batsmanDoc);

//     const bowlerDoc = await Player.findById(bowlerId);
//     console.log("bowlerDoc = ", bowlerDoc);
//     if (!batsmanDoc || !bowlerDoc)
//       throw new Error("Batsman or bowler not found");

//     // ✅ Ensure nested fields exist
//     if (!batsmanDoc.battingStats) {
//       batsmanDoc.battingStats = {
//         runs: 0,
//         balls: 0,
//         fours: 0,
//         sixes: 0,
//         isOut: false,
//       };
//     } else {
//       batsmanDoc.battingStats.runs ??= 0;
//       batsmanDoc.battingStats.balls ??= 0;
//       batsmanDoc.battingStats.fours ??= 0;
//       batsmanDoc.battingStats.sixes ??= 0;
//       batsmanDoc.battingStats.isOut ??= false;
//     }

//     if (!bowlerDoc.bowlingStats) {
//       bowlerDoc.bowlingStats = {
//         wickets: 0,
//         overs: 0,
//         maidens: 0,
//         runsConceded: 0,
//       };
//     } else {
//       bowlerDoc.bowlingStats.overs ??= 0;
//       bowlerDoc.bowlingStats.wickets ??= 0;
//       bowlerDoc.bowlingStats.maidens ??= 0;
//       bowlerDoc.bowlingStats.runsConceded ??= 0;
//     }

//     let battingStats = batsmanDoc.battingStats;
//     let bowlingStats = bowlerDoc.bowlingStats;

//     console.log("battingStats", battingStats);
//     console.log("bowlingStats", bowlingStats);

//     const legalBall =
//       !deliveryType.includes("noball") && !deliveryType.includes("wide");

//     // ✅ Batsman stats
//     if (deliveryType === "normal" || deliveryType === "normal+overthrow") {
//       battingStats.runs += runs;
//       battingStats.balls = !battingStats.balls ? 1 : battingStats.balls + 1;

//       if (runs === 4)
//         battingStats.fours =
//           battingStats.fours === undefined || battingStats.fours === null
//             ? 1
//             : battingStats.fours + 1;
//       if (runs === 6)
//         battingStats.sixes =
//           battingStats.sixes === undefined || battingStats.sixes === null
//             ? 1
//             : battingStats.sixes + 1;
//     } else if (
//       deliveryType.includes("noball") ||
//       deliveryType.includes("wide")
//     ) {
//       if (runs > 0 && deliveryType === "noball") {
//         if (battingStats.runs === undefined || battingStats.runs === null) {
//           battingStats.runs = runs - 1;
//         } else {
//           battingStats.runs += runs - 1;
//         }

//         if (battingStats.balls === undefined || battingStats.balls === null) {
//           battingStats.balls = 1;
//         } else {
//           battingStats.balls += 1;
//         }
//       }
//     } else if (deliveryType === "bye" || deliveryType === "legbye") {
//       if (battingStats.balls === undefined || battingStats.balls === null) {
//         battingStats.balls = 1;
//       } else {
//         battingStats.balls += 1;
//       }
//     }

//     // ✅ Bowler stats
//     if (legalBall) {
//       bowlingStats.overs = !bowlingStats.overs ? 0.1 : bowlingStats.overs + 0.1;
//     }

//     bowlingStats.runsConceded +=
//       extras.noball + extras.wide + extras.overthrow + runs;

//     if (isWicket) {
//       if (!bowlingStats.wickets) bowlingStats.wickets = 1;
//       else bowlingStats.wickets += 1;

//       battingStats.isOut = true;
//     }

//     await batsmanDoc.save();
//     await bowlerDoc.save();

//     // ✅ Team + Match update
//     const match = await Match.findById(matchId);
//     if (!match) throw new Error("Match not found");

//     const battingTeamId = String(
//       match.currentInnings === 1 ? match.teamA : match.teamB
//     );
//     const team = await Team.findById(battingTeamId);
//     if (!team) throw new Error("Team not found");

//     team.totalRuns +=
//       runs +
//       extras.noball +
//       extras.wide +
//       extras.bye +
//       extras.legbye +
//       extras.overthrow;

//     if (isWicket) team.wickets += 1;

//     team.extras = team.extras || { wide: 0, noball: 0, bye: 0, legbye: 0 };
//     team.extras.wide += extras.wide;
//     team.extras.noball += extras.noball;
//     team.extras.bye += extras.bye;
//     team.extras.legbye += extras.legbye;

//     // ✅ Overs tracking
//     if (legalBall) {
//       const overs = team.overs ?? 0;
//       let updatedOvers = overs + 0.1;
//       const balls = Math.round((updatedOvers % 1) * 10);
//       if (balls >= 6) updatedOvers = Math.floor(updatedOvers) + 1;
//       team.overs = Number(updatedOvers.toFixed(1));
//     }

//     await team.save();

//     res.status(201).json({ message: "Delivery recorded and stats updated" });
//   } catch (err: any) {
//     res
//       .status(500)
//       .json({ message: "Failed to process delivery", error: err.message });
//   }
// };



