import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '../../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET! || 'abcde',
  },
  async (payload, done) => {
    try {
      console.log('[JWT payload]', payload);
      const user = await prisma.users.findUnique({
        where: { id: Number(payload.id) },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
        },
      });

      console.log('[JWT user]', user);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);
