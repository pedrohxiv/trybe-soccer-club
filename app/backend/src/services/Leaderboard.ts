import { Op, literal } from 'sequelize';
import matchModel from '../database/models/Match';
import teamModel from '../database/models/Team';
import { HTI, ATI, HTG, ATG, MHTG, MATG, MHTGMATG, MATGMHTG } from '../utils/StringParams';

interface Ranking {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: string;
}

async function getTG(teamField: string, teamId: number) {
  const totalGames = await matchModel.count({
    where: {
      [teamField]: teamId,
      inProgress: false,
    },
  });
  return totalGames;
}

async function getTV(
  teamIdField: string,
  teamId: number,
  teamGoalsField: string,
  teamGoals: string,
) {
  const totalVictories = await matchModel.count({
    where: {
      [Op.and]: [
        { [teamIdField]: teamId },
        { [teamGoalsField]: { [Op.gt]: literal(teamGoals) } },
        { inProgress: false },
      ],
    },
  });
  return totalVictories;
}

async function getTD(teamIdField: string, teamId: number, literalString: string) {
  const totalDraws = await matchModel.count({
    where: {
      [Op.and]: [
        { [teamIdField]: teamId },
        literal(literalString),
        { inProgress: false },
      ],
    },
  });
  return totalDraws;
}

async function getGFO(
  teamGoals: string,
  teamIdField: string,
  teamId: number,
) {
  const goalsFavorOrOwn = await matchModel.sum(teamGoals, {
    where: {
      [teamIdField]: teamId,
      inProgress: false,
    },
  });
  return goalsFavorOrOwn;
}

function sortRanking(ranking: Ranking[]) {
  return ranking.sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (a.totalVictories !== b.totalVictories) {
      return b.totalVictories - a.totalVictories;
    }
    if (a.goalsFavor - a.goalsOwn !== b.goalsFavor - b.goalsOwn) {
      return b.goalsFavor - b.goalsOwn - (a.goalsFavor - a.goalsOwn);
    }
    return b.goalsFavor - a.goalsFavor;
  });
}

export async function getAllHomeRanking() {
  const teams = await teamModel.findAll();

  const ranking = teams.map(async (team) => ({
    name: team.teamName,
    totalPoints: (await getTV(HTI, team.id, HTG, MATG) * 3) + await getTD(HTI, team.id, MHTGMATG),
    totalGames: await getTG(HTI, team.id),
    totalVictories: await getTV(HTI, team.id, HTG, MATG),
    totalDraws: await getTD(HTI, team.id, MHTGMATG),
    totalLosses: await getTG(HTI, team.id)
     - await getTV(HTI, team.id, HTG, MATG) - await getTD(HTI, team.id, MHTGMATG),
    goalsFavor: await getGFO(HTG, HTI, team.id),
    goalsOwn: await getGFO(ATG, HTI, team.id),
    goalsBalance: await getGFO(HTG, HTI, team.id) - await getGFO(ATG, HTI, team.id),
    efficiency: (
      (((await getTV(HTI, team.id, HTG, MATG) * 3) + await getTD(HTI, team.id, MHTGMATG))
      / (await getTG(HTI, team.id) * 3)) * 100).toFixed(2),
  }));

  return sortRanking(await Promise.all(ranking));
}

export async function getAllAwayRanking() {
  const teams = await teamModel.findAll();

  const ranking = teams.map(async (team) => ({
    name: team.teamName,
    totalPoints: (await getTV(ATI, team.id, ATG, MHTG) * 3) + await getTD(ATI, team.id, MATGMHTG),
    totalGames: await getTG(ATI, team.id),
    totalVictories: await getTV(ATI, team.id, ATG, MHTG),
    totalDraws: await getTD(ATI, team.id, MATGMHTG),
    totalLosses: await getTG(ATI, team.id)
     - await getTV(ATI, team.id, ATG, MHTG) - await getTD(ATI, team.id, MATGMHTG),
    goalsFavor: await getGFO(ATG, ATI, team.id),
    goalsOwn: await getGFO(HTG, ATI, team.id),
    goalsBalance: await getGFO(ATG, ATI, team.id) - await getGFO(HTG, ATI, team.id),
    efficiency: (
      (((await getTV(ATI, team.id, ATG, MHTG) * 3) + await getTD(ATI, team.id, MATGMHTG))
      / (await getTG(ATI, team.id) * 3)) * 100).toFixed(2),
  }));

  return sortRanking(await Promise.all(ranking));
}

function updateTeamStats(existingTeam: Ranking, team: Ranking) {
  const updatedTeam = {
    ...existingTeam,
    totalPoints: existingTeam.totalPoints + team.totalPoints,
    totalGames: existingTeam.totalGames + team.totalGames,
    totalVictories: existingTeam.totalVictories + team.totalVictories,
    totalDraws: existingTeam.totalDraws + team.totalDraws,
    totalLosses: existingTeam.totalLosses + team.totalLosses,
    goalsFavor: existingTeam.goalsFavor + team.goalsFavor,
    goalsOwn: existingTeam.goalsOwn + team.goalsOwn,
    goalsBalance: existingTeam.goalsBalance + team.goalsBalance,
    efficiency: (((existingTeam.totalPoints + team.totalPoints)
     / ((existingTeam.totalGames + team.totalGames) * 3)) * 100).toFixed(2),
  };

  Object.assign(existingTeam, updatedTeam);
}

function mergeRankings(homeRanking: Ranking[], awayRanking: Ranking[]) {
  const combinedRanking = [...homeRanking];

  awayRanking.forEach((team) => {
    const existingTeam = combinedRanking.find((t) => t.name === team.name);
    if (existingTeam) {
      updateTeamStats(existingTeam, team);
    } else {
      combinedRanking.push(team);
    }
  });

  return combinedRanking;
}

export async function getAllTotalRanking() {
  const homeRanking = await getAllHomeRanking();
  const awayRanking = await getAllAwayRanking();

  const combinedRanking = mergeRankings(homeRanking, awayRanking);

  return sortRanking(combinedRanking);
}
