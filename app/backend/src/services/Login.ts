import { sign, decode, JwtPayload } from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import httpErrorGenerator from '../utils/httpErrorGenerator';
import userModel from '../database/models/User';

async function validateEmailAndPassword(email: string, password: string) {
  if (!email || !password) {
    throw httpErrorGenerator(400, 'All fields must be filled');
  }
  const user = (await userModel.findOne({ where: { email } })) as userModel;
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    || !user
    || password.length < 6
    || !compareSync(password, user.password)
  ) {
    throw httpErrorGenerator(401, 'Invalid email or password');
  }
  return { id: user.id, role: user.role };
}

export async function signin(email: string, password: string) {
  const user = await validateEmailAndPassword(email, password);
  return {
    token: sign(user, process.env.JWT_SECRET || 'jwt_secret', {
      expiresIn: '180d',
      algorithm: 'HS256',
    }),
  };
}

export async function getRole(token: string) {
  const { role } = decode(token) as JwtPayload;
  return { role };
}
