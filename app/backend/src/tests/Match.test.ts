import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { sign } from 'jsonwebtoken';
import { app } from '../app';
import MatchModel from '../database/models/Match';
import { allMatches, inProgressMatches, notInProgressMatches } from './mocks/Match.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Partidas', () => {
  describe('Lista todas as partidas', () => {
    beforeEach(() => {
      const execute = allMatches;

      sinon.stub(MatchModel, 'findAll').resolves(execute as unknown as MatchModel[]);
    });

    afterEach(() => {
      (MatchModel.findAll as sinon.SinonStub).restore();
    });

    const expected = allMatches;

    it('Verifica se a função retorna uma resposta com status 200', async () => {
      const response = await chai.request(app).get('/matches');

      expect(response.status).to.be.equal(200);
    });

    it('Verifica se a função retorna uma estrutura de array', async () => {
      const response = await chai.request(app).get('/matches');

      expect(response.body).to.be.a('array');
    });

    it('Verifica se a função retorna a lista em um formato especifico', async () => {
      const response = await chai.request(app).get('/matches');

      expect(response.body).to.deep.equal(expected);
    });
  });

  describe('Lista somente as partidas em andamento', () => {
    beforeEach(() => {
      const execute = inProgressMatches;

      sinon.stub(MatchModel, 'findAll').resolves(execute as unknown as MatchModel[]);
    });

    afterEach(() => {
      (MatchModel.findAll as sinon.SinonStub).restore();
    });

    const expected = inProgressMatches;

    it('Verifica se a função retorna uma resposta com status 200', async () => {
      const response = await chai.request(app).get('/matches?inProgress=true');

      expect(response.status).to.be.equal(200);
    });

    it('Verifica se a função retorna uma estrutura de array', async () => {
      const response = await chai.request(app).get('/matches?inProgress=true');

      expect(response.body).to.be.a('array');
    });

    it('Verifica se a função retorna a lista em um formato especifico', async () => {
      const response = await chai.request(app).get('/matches?inProgress=true');

      expect(response.body).to.deep.equal(expected);
    });
  });

  describe('Lista somente as partidas finalizadas', () => {
    beforeEach(() => {
      const execute = notInProgressMatches;

      sinon.stub(MatchModel, 'findAll').resolves(execute as unknown as MatchModel[]);
    });

    afterEach(() => {
      (MatchModel.findAll as sinon.SinonStub).restore();
    });

    const expected = notInProgressMatches;

    it('Verifica se a função retorna uma resposta com status 200', async () => {
      const response = await chai.request(app).get('/matches?inProgress=false');

      expect(response.status).to.be.equal(200);
    });

    it('Verifica se a função retorna uma estrutura de array', async () => {
      const response = await chai.request(app).get('/matches?inProgress=false');

      expect(response.body).to.be.a('array');
    });

    it('Verifica se a função retorna a lista em um formato especifico', async () => {
      const response = await chai.request(app).get('/matches?inProgress=false');

      expect(response.body).to.deep.equal(expected);
    });
  });

  describe('Finaliza uma partida', () => {
    describe('Sem um token', () => {
      const expected = { message: 'Token not found' };

      it('Verifica se a função retorna uma resposta com status 401', async () => {
        const response = await chai.request(app).patch('/matches/1/finish');

        expect(response.status).to.be.equal(401);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai.request(app).patch('/matches/1/finish');

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Token not found"', async () => {
        const response = await chai.request(app).patch('/matches/1/finish');

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com um token inválido', () => {
      const expected = { message: 'Token must be a valid token' };

      it('Verifica se a função retorna uma resposta com status 401', async () => {
        const response = await chai
          .request(app)
          .patch('/matches/1/finish')
          .set('authorization', 'token');

        expect(response.status).to.be.equal(401);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .patch('/matches/1/finish')
          .set('authorization', 'token');

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Token must be a valid token"', async () => {
        const response = await chai
          .request(app)
          .patch('/matches/1/finish')
          .set('authorization', 'token');

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com um token válido', () => {
      beforeEach(() => {
        sinon.stub(MatchModel, 'update').resolves();
      });

      afterEach(() => {
        (MatchModel.update as sinon.SinonStub).restore();
      });

      const token = sign(
        { id: 1, role: 'admin' },
        process.env.JWT_SECRET || 'jwt_secret',
        {
          expiresIn: '180d',
          algorithm: 'HS256',
        },
      );

      const expected = { message: 'Finished' };

      it('Verifica se a função retorna uma resposta com status 200', async () => {
        const response = await chai
          .request(app)
          .patch('/matches/1/finish')
          .set('authorization', token);

        expect(response.status).to.be.equal(200);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .patch('/matches/1/finish')
          .set('authorization', token);

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a "role" do usuário', async () => {
        const response = await chai
          .request(app)
          .patch('/matches/1/finish')
          .set('authorization', token);

        expect(response.body).to.deep.equal(expected);
      });
    });
  });

  describe('Atualiza partida em andamento', () => {
    describe('Sem um token', () => {
      const expected = { message: 'Token not found' };

      it('Verifica se a função retorna uma resposta com status 401', async () => {
        const response = await chai.request(app).patch('/matches/1');

        expect(response.status).to.be.equal(401);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai.request(app).patch('/matches/1');

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Token not found"', async () => {
        const response = await chai.request(app).patch('/matches/1');

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com um token inválido', () => {
      const expected = { message: 'Token must be a valid token' };

      it('Verifica se a função retorna uma resposta com status 401', async () => {
        const response = await chai
          .request(app)
          .patch('/matches/1')
          .set('authorization', 'token');

        expect(response.status).to.be.equal(401);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .patch('/matches/1')
          .set('authorization', 'token');

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Token must be a valid token"', async () => {
        const response = await chai
          .request(app)
          .patch('/matches/1')
          .set('authorization', 'token');

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com um token válido e um corpo na requisição', () => {
      beforeEach(() => {
        sinon.stub(MatchModel, 'update').resolves();
      });

      afterEach(() => {
        (MatchModel.update as sinon.SinonStub).restore();
      });

      const token = sign(
        { id: 1, role: 'admin' },
        process.env.JWT_SECRET || 'jwt_secret',
        {
          expiresIn: '180d',
          algorithm: 'HS256',
        },
      );

      it('Verifica se a função retorna uma resposta com status 200', async () => {
        const response = await chai
          .request(app)
          .patch('/matches/1')
          .set('authorization', token)
          .send({
            homeTeamGoals: 3,
            awayTeamGoals: 1,
          });

        expect(response.status).to.be.equal(200);
      });
    });
  });

  describe('Cadastra uma nova partida em andamento', () => {
    describe('Sem um token', () => {
      const expected = { message: 'Token not found' };

      it('Verifica se a função retorna uma resposta com status 401', async () => {
        const response = await chai.request(app).post('/matches');

        expect(response.status).to.be.equal(401);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai.request(app).post('/matches');

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Token not found"', async () => {
        const response = await chai.request(app).post('/matches');

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com um token inválido', () => {
      const expected = { message: 'Token must be a valid token' };

      it('Verifica se a função retorna uma resposta com status 401', async () => {
        const response = await chai
          .request(app)
          .post('/matches')
          .set('authorization', 'token');

        expect(response.status).to.be.equal(401);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .post('/matches')
          .set('authorization', 'token');

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Token must be a valid token"', async () => {
        const response = await chai
          .request(app)
          .post('/matches')
          .set('authorization', 'token');

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com um token válido mas com times iguais no corpo da requisição', () => {
      const token = sign(
        { id: 1, role: 'admin' },
        process.env.JWT_SECRET || 'jwt_secret',
        {
          expiresIn: '180d',
          algorithm: 'HS256',
        },
      );

      const expected = {
        message: 'It is not possible to create a match with two equal teams',
      };

      it('Verifica se a função retorna uma resposta com status 422', async () => {
        const response = await chai
          .request(app)
          .post('/matches')
          .set('authorization', token)
          .send({
            homeTeamId: 1,
            awayTeamId: 1,
            homeTeamGoals: 2,
            awayTeamGoals: 2,
          });

        expect(response.status).to.be.equal(422);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .post('/matches')
          .set('authorization', token)
          .send({
            homeTeamId: 1,
            awayTeamId: 1,
            homeTeamGoals: 2,
            awayTeamGoals: 2,
          });

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "It is not possible to create a match with two equal teams"', async () => {
        const response = await chai
          .request(app)
          .post('/matches')
          .set('authorization', token)
          .send({
            homeTeamId: 1,
            awayTeamId: 1,
            homeTeamGoals: 2,
            awayTeamGoals: 2,
          });

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com um token válido mas com um time que não existe no corpo da requisição', () => {
      const token = sign(
        { id: 1, role: 'admin' },
        process.env.JWT_SECRET || 'jwt_secret',
        {
          expiresIn: '180d',
          algorithm: 'HS256',
        },
      );

      const expected = { message: 'There is no team with such id!' };

      it('Verifica se a função retorna uma resposta com status 404', async () => {
        const response = await chai
          .request(app)
          .post('/matches')
          .set('authorization', token)
          .send({
            homeTeamId: 999,
            awayTeamId: 8,
            homeTeamGoals: 2,
            awayTeamGoals: 2,
          });

        expect(response.status).to.be.equal(404);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .post('/matches')
          .set('authorization', token)
          .send({
            homeTeamId: 999,
            awayTeamId: 8,
            homeTeamGoals: 2,
            awayTeamGoals: 2,
          });

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "There is no team with such id!"', async () => {
        const response = await chai
          .request(app)
          .post('/matches')
          .set('authorization', token)
          .send({
            homeTeamId: 999,
            awayTeamId: 8,
            homeTeamGoals: 2,
            awayTeamGoals: 2,
          });

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com um token válido e um corpo válido na requisição', () => {
      beforeEach(() => {
        const execute = {
          id: 1,
          homeTeamId: 16,
          awayTeamId: 8,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
          inProgress: true,
        };

        sinon.stub(MatchModel, 'create').resolves(execute as unknown as MatchModel);
      });

      afterEach(() => {
        (MatchModel.create as sinon.SinonStub).restore();
      });

      const token = sign(
        { id: 1, role: 'admin' },
        process.env.JWT_SECRET || 'jwt_secret',
        {
          expiresIn: '180d',
          algorithm: 'HS256',
        },
      );

      const expected = {
        id: 1,
        homeTeamId: 16,
        awayTeamId: 8,
        homeTeamGoals: 2,
        awayTeamGoals: 2,
        inProgress: true,
      };

      it('Verifica se a função retorna uma resposta com status 201', async () => {
        const response = await chai
          .request(app)
          .post('/matches')
          .set('authorization', token)
          .send({
            homeTeamId: 16,
            awayTeamId: 8,
            homeTeamGoals: 2,
            awayTeamGoals: 2,
          });

        expect(response.status).to.be.equal(201);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .post('/matches')
          .set('authorization', token)
          .send({
            homeTeamId: 16,
            awayTeamId: 8,
            homeTeamGoals: 2,
            awayTeamGoals: 2,
          });

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna os dados da partida', async () => {
        const response = await chai
          .request(app)
          .post('/matches')
          .set('authorization', token)
          .send({
            homeTeamId: 16,
            awayTeamId: 8,
            homeTeamGoals: 2,
            awayTeamGoals: 2,
          });

        expect(response.body).to.deep.equal(expected);
      });
    });
  });
});
