import httpErrorGenerator from '../utils/httpErrorGenerator';
import matchModel from '../database/models/Match';
import teamModel from '../database/models/Team';

export async function getAll(inProgress: string) {
  const matches = await matchModel.findAll({
    include: [
      { model: teamModel, as: 'homeTeam', attributes: ['teamName'] },
      { model: teamModel, as: 'awayTeam', attributes: ['teamName'] },
    ],
    where: inProgress ? { inProgress: inProgress === 'true' } : undefined,
  });

  return matches;
}

export async function finishMatch(id: number) {
  await matchModel.update({ inProgress: false }, { where: { id } });

  return { message: 'Finished' };
}

export async function updateMatchInProgress(
  id: number,
  homeTeamGoals: number,
  awayTeamGoals: number,
) {
  await matchModel.update(
    { homeTeamGoals, awayTeamGoals },
    { where: { id, inProgress: true } },
  );
}

async function validateCreate(homeTeamId: number, awayTeamId: number) {
  if (homeTeamId === awayTeamId) {
    throw httpErrorGenerator(
      422,
      'It is not possible to create a match with two equal teams',
    );
  }
  const homeTeam = await teamModel.findByPk(homeTeamId);
  const awayTeam = await teamModel.findByPk(awayTeamId);
  if (!homeTeam || !awayTeam) {
    throw httpErrorGenerator(404, 'There is no team with such id!');
  }
}

export async function create(
  homeTeamId: number,
  awayTeamId: number,
  homeTeamGoals: number,
  awayTeamGoals: number,
) {
  await validateCreate(homeTeamId, awayTeamId);

  const newMatch = matchModel.create({
    homeTeamId,
    awayTeamId,
    homeTeamGoals,
    awayTeamGoals,
    inProgress: true,
  });

  return newMatch;
}
