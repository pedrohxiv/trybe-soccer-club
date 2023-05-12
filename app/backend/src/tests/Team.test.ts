import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/Team';

chai.use(chaiHttp);

const { expect } = chai;

describe('Times', () => {
  describe('Lista todos os times', () => {
    beforeEach(() => {
      const execute = [
        { id: 1, teamName: 'Real Madrid' },
        { id: 2, teamName: 'Barcelona' },
        { id: 3, teamName: 'Manchester United' },
        { id: 4, teamName: 'Liverpool' },
        { id: 5, teamName: 'Bayern Munich' },
      ];

      sinon.stub(TeamModel, 'findAll').resolves(execute as TeamModel[]);
    });

    afterEach(() => {
      (TeamModel.findAll as sinon.SinonStub).restore();
    });

    const expected = [
      { id: 1, teamName: 'Real Madrid' },
      { id: 2, teamName: 'Barcelona' },
      { id: 3, teamName: 'Manchester United' },
      { id: 4, teamName: 'Liverpool' },
      { id: 5, teamName: 'Bayern Munich' },
    ];

    it('Verifica se a função retorna uma resposta com status 200', async () => {
      const response = await chai.request(app).get('/teams');

      expect(response.status).to.be.equal(200);
    });

    it('Verifica se a função retorna uma estrutura de array', async () => {
      const response = await chai.request(app).get('/teams');

      expect(response.body).to.be.a('array');
    });

    it('Verifica se a função retorna a lista em um formato especifico', async () => {
      const response = await chai.request(app).get('/teams');

      expect(response.body).to.deep.equal(expected);
    });
  });

  describe('Lista um time por id', () => {
    describe('Com um id inválido', () => {
      beforeEach(() => {
        const execute = null;

        sinon.stub(TeamModel, 'findByPk').resolves(execute);
      });

      afterEach(() => {
        (TeamModel.findByPk as sinon.SinonStub).restore();
      });

      const expected = { message: 'Team not registered' };

      it('Verifica se a função retorna uma resposta com status 404', async () => {
        const response = await chai.request(app).get('/teams/999');

        expect(response.status).to.be.equal(404);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai.request(app).get('/teams/999');

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Team not registered"', async () => {
        const response = await chai.request(app).get('/teams/999');

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com um id válido', () => {
      beforeEach(() => {
        const execute = { id: 1, teamName: 'Real Madrid' };

        sinon.stub(TeamModel, 'findByPk').resolves(execute as unknown as TeamModel);
      });

      afterEach(() => {
        (TeamModel.findByPk as sinon.SinonStub).restore();
      });

      const expected = { id: 1, teamName: 'Real Madrid' };

      it('Verifica se a função retorna uma resposta com status 200', async () => {
        const response = await chai.request(app).get('/teams/1');

        expect(response.status).to.be.equal(200);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai.request(app).get('/teams/1');

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna o objeto com o id esperado', async () => {
        const response = await chai.request(app).get('/teams/1');

        expect(response.body).to.deep.equal(expected);
      });
    });
  });
});
