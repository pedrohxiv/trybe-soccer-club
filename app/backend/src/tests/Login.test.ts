import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { sign } from 'jsonwebtoken';
import { app } from '../app';
import UserModel from '../database/models/User';

chai.use(chaiHttp);

const { expect } = chai;

describe('Pessoas Usuárias e Credenciais de acesso', () => {
  describe('Efetua o login da pessoa usuaria', () => {
    describe('Sem o campo "email"', () => {
      beforeEach(() => {
        const execute = null;

        sinon.stub(UserModel, 'findOne').resolves(execute);
      });

      afterEach(() => {
        (UserModel.findOne as sinon.SinonStub).restore();
      });

      const expected = { message: 'All fields must be filled' };

      it('Verifica se a função retorna uma resposta com status 400', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ password: 'secret_admin' });

        expect(response.status).to.be.equal(400);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ password: 'secret_admin' });

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "All fields must be filled"', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ password: 'secret_admin' });

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Sem o campo "password"', () => {
      beforeEach(() => {
        const execute = null;

        sinon.stub(UserModel, 'findOne').resolves(execute);
      });

      afterEach(() => {
        (UserModel.findOne as sinon.SinonStub).restore();
      });

      const expected = { message: 'All fields must be filled' };

      it('Verifica se a função retorna uma resposta com status 400', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin@admin.com' });

        expect(response.status).to.be.equal(400);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin@admin.com' });

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "All fields must be filled"', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin@admin.com' });

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com um email com formato inválido', () => {
      beforeEach(() => {
        const execute = null;

        sinon.stub(UserModel, 'findOne').resolves(execute);
      });

      afterEach(() => {
        (UserModel.findOne as sinon.SinonStub).restore();
      });

      const expected = { message: 'Invalid email or password' };

      it('Verifica se a função retorna uma resposta com status 401', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin.admin.com', password: 'secret_admin' });

        expect(response.status).to.be.equal(401);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin.admin.com', password: 'secret_admin' });

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Invalid email or password"', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin.admin.com', password: 'secret_admin' });

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com um email com formato válido, mas não cadastrados no banco', () => {
      beforeEach(() => {
        const execute = null;

        sinon.stub(UserModel, 'findOne').resolves(execute);
      });

      afterEach(() => {
        (UserModel.findOne as sinon.SinonStub).restore();
      });

      const expected = { message: 'Invalid email or password' };

      it('Verifica se a função retorna uma resposta com status 401', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'pedro@admin.com', password: 'secret_admin' });

        expect(response.status).to.be.equal(401);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'pedro@admin.com', password: 'secret_admin' });

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Invalid email or password"', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'pedro@admin.com', password: 'secret_admin' });

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com uma senha com formato inválido, com um tamanho menor do que 6 caracteres', () => {
      beforeEach(() => {
        const execute = null;

        sinon.stub(UserModel, 'findOne').resolves(execute);
      });

      afterEach(() => {
        (UserModel.findOne as sinon.SinonStub).restore();
      });

      const expected = { message: 'Invalid email or password' };

      it('Verifica se a função retorna uma resposta com status 401', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin@admin.com', password: 'admin' });

        expect(response.status).to.be.equal(401);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin@admin.com', password: 'admin' });

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Invalid email or password"', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin@admin.com', password: 'admin' });

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com uma senha com formato válido, mas não cadastrados no banco', () => {
      beforeEach(() => {
        const execute = null;

        sinon.stub(UserModel, 'findOne').resolves(execute);
      });

      afterEach(() => {
        (UserModel.findOne as sinon.SinonStub).restore();
      });

      const expected = { message: 'Invalid email or password' };

      it('Verifica se a função retorna uma resposta com status 401', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin@admin.com', password: 'pedro_secret_admin' });

        expect(response.status).to.be.equal(401);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin@admin.com', password: 'pedro_secret_admin' });

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Invalid email or password"', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin@admin.com', password: 'pedro_secret_admin' });

        expect(response.body).to.deep.equal(expected);
      });
    });

    describe('Com todas as informações válidas', () => {
      beforeEach(() => {
        const execute = {
          id: 1,
          username: 'Admin',
          role: 'admin',
          email: 'admin@admin.com',
          password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
        };

        sinon.stub(UserModel, 'findOne').resolves(execute as UserModel);
      });

      afterEach(() => {
        (UserModel.findOne as sinon.SinonStub).restore();
      });

      const expected = 'token';

      it('Verifica se a função retorna uma resposta com status 200', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin@admin.com', password: 'secret_admin' });

        expect(response.status).to.be.equal(200);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin@admin.com', password: 'secret_admin' });

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna um token', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'admin@admin.com', password: 'secret_admin' });

        expect(response.body).to.have.property(expected);
      });
    });
  });
  describe('Retorna a "role" da pessoa usuaria', () => {
    describe('Sem um token', () => {
      const expected = { message: 'Token not found' };

      it('Verifica se a função retorna uma resposta com status 401', async () => {
        const response = await chai.request(app).get('/login/role');

        expect(response.status).to.be.equal(401);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai.request(app).get('/login/role');

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Token not found"', async () => {
        const response = await chai.request(app).get('/login/role');

        expect(response.body).to.deep.equal(expected);
      });
    });
    describe('Com um token inválido', () => {
      const expected = { message: 'Token must be a valid token' };

      it('Verifica se a função retorna uma resposta com status 401', async () => {
        const response = await chai
          .request(app)
          .get('/login/role')
          .set('authorization', 'token');

        expect(response.status).to.be.equal(401);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .get('/login/role')
          .set('authorization', 'token');

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a mensagem "Token must be a valid token"', async () => {
        const response = await chai
          .request(app)
          .get('/login/role')
          .set('authorization', 'token');

        expect(response.body).to.deep.equal(expected);
      });
    });
    describe('Com um token válido', () => {
      const token = sign(
        { id: 1, role: 'admin' },
        process.env.JWT_SECRET || 'jwt_secret',
        {
          expiresIn: '180d',
          algorithm: 'HS256',
        },
      );

      const expected = { role: 'admin' };

      it('Verifica se a função retorna uma resposta com status 200', async () => {
        const response = await chai
          .request(app)
          .get('/login/role')
          .set('authorization', token);

        expect(response.status).to.be.equal(200);
      });

      it('Verifica se a função retorna um objeto', async () => {
        const response = await chai
          .request(app)
          .get('/login/role')
          .set('authorization', token);

        expect(response.body).to.be.a('object');
      });

      it('Verifica se a função retorna a "role" do usuário', async () => {
        const response = await chai
          .request(app)
          .get('/login/role')
          .set('authorization', token);

        expect(response.body).to.deep.equal(expected);
      });
    });
  });
});
