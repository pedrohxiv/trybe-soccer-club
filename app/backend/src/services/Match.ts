import httpErrorGenerator from '../utils/httpErrorGenerator';
import matchModel from '../database/models/Match';
import Team from '../database/models/Team';

export async function getAll(inProgress: string) {
  const matches = await matchModel.findAll({
    include: [
      { model: Team, as: 'homeTeam', attributes: ['teamName'] },
      { model: Team, as: 'awayTeam', attributes: ['teamName'] },
    ],
    where: inProgress ? { inProgress: inProgress === 'true' } : undefined,
  });

  return matches;
}

export async function getById(id: number) {
  const match = await matchModel.findByPk(id);

  if (!match) throw httpErrorGenerator(404, 'Match not registered');

  return match;
}
