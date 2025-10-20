import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const localStrategy = new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const user = await prisma.users.findUnique({ where: { email } });
      if (!user) return done(null, false, { message: '존재하지 않는 유저' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: '비밀번호 불일치' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);
