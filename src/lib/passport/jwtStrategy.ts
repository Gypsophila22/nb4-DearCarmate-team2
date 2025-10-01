import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '../../../generated/prisma/index.js';

const prisma = new PrismaClient();

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
    },
    async (payload, done) => {
      try {
        const user = await prisma.users.findUnique({
          where: { id: payload.id },
          select: {
            id: true,
            email: true,
            name: true,
            isAdmin: true,
          },
        });
        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
