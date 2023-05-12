import httpErrorGenerator from '../utils/httpErrorGenerator';
import teamModel from '../database/models/Team';

export async function getAll() {
  const teams = await teamModel.findAll();

  return teams;
}

export async function getById(id: number) {
  const team = await teamModel.findByPk(id);

  if (!team) throw httpErrorGenerator(404, 'Team not registered');

  return team;
}
