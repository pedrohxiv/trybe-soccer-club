import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/Team';
import { allTeams } from './mocks/Team.mock';
import { awayLeaderboard, homeLeaderboard, leaderboard } from './mocks/Leaderboard.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Placares', () => {
  describe('Lista a classificação dos times da casa', () => {
    beforeEach(() => {
      const execute = allTeams;

      sinon.stub(TeamModel, 'findAll').resolves(execute as unknown as TeamModel[]);
    });

    afterEach(() => {
      (TeamModel.findAll as sinon.SinonStub).restore();
    });

    const expected = homeLeaderboard;

    it('Verifica se a função retorna uma resposta com status 200', async () => {
      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.status).to.be.equal(200);
    });

    it('Verifica se a função retorna uma estrutura de array', async () => {
      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.body).to.be.a('array');
    });

    it('Verifica se a função retorna a lista em um formato especifico', async () => {
      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.body).to.deep.equal(expected);
    });
  });

  describe('Lista a classificação dos times visitantes', () => {
    beforeEach(() => {
      const execute = allTeams;

      sinon.stub(TeamModel, 'findAll').resolves(execute as unknown as TeamModel[]);
    });

    afterEach(() => {
      (TeamModel.findAll as sinon.SinonStub).restore();
    });

    const expected = awayLeaderboard;

    it('Verifica se a função retorna uma resposta com status 200', async () => {
      const response = await chai.request(app).get('/leaderboard/away');

      expect(response.status).to.be.equal(200);
    });

    it('Verifica se a função retorna uma estrutura de array', async () => {
      const response = await chai.request(app).get('/leaderboard/away');

      expect(response.body).to.be.a('array');
    });

    it('Verifica se a função retorna a lista em um formato especifico', async () => {
      const response = await chai.request(app).get('/leaderboard/away');

      expect(response.body).to.deep.equal(expected);
    });
  });

  describe('Lista a classificação geral dos times', () => {
    beforeEach(() => {
      const execute = allTeams;

      sinon.stub(TeamModel, 'findAll').resolves(execute as unknown as TeamModel[]);
    });

    afterEach(() => {
      (TeamModel.findAll as sinon.SinonStub).restore();
    });

    const expected = leaderboard;

    it('Verifica se a função retorna uma resposta com status 200', async () => {
      const response = await chai.request(app).get('/leaderboard');

      expect(response.status).to.be.equal(200);
    });

    it('Verifica se a função retorna uma estrutura de array', async () => {
      const response = await chai.request(app).get('/leaderboard');

      expect(response.body).to.be.a('array');
    });

    it('Verifica se a função retorna a lista em um formato especifico', async () => {
      const response = await chai.request(app).get('/leaderboard');

      expect(response.body).to.deep.equal(expected);
    });
  });
});
