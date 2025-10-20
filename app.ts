import './src/config/env.js';

import express, {
  request,
  Router,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';
import path from 'path';
import passport from 'passport';

import errorHandler from './src/middlewares/errorHandler.js';
import { requestLogger } from './src/middlewares/logger.js';
import routers from './src/routers/index.js';

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);

//테스트 용으로 만들어놓은 cors입니다.
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.use('/auth', routers.authRouter);
app.use('/users', routers.userRouter);
app.use('/cars', routers.carRouter);

//app.use('/admin', routers.companyRouter);

app.use('/images', routers.imageRouter);

// customer 라우터는 별도로 추가합니다.
app.use('/customers', routers.customersRouter);

app.use('/companies', routers.companyRouter);

const testrouter = Router();
testrouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  console.warn('테스트용 더미 코드');
  res.json({
    carInspection: {
      totalItemCount: 1,
      data: [
        {
          id: 1,
          car: {
            id: 1,
            model: 'K5',
          },
          customer: {
            id: 1,
            name: '최효정',
          },
          user: {
            id: 1,
            name: '김연우',
          },
          meetings: [
            {
              date: '2024-02-22',
              alarms: ['2024-02-22T09:00:00.000Z', '2024-02-21T09:00:00.000Z'],
            },
          ],
          contractPrice: 2000000,
          resolutionDate: '2024-02-22T07:47:49.803Z',
          status: 'contractSuccessful',
        },
      ],
    },
    priceNegotiation: {
      totalItemCount: 1,
      data: [
        {
          id: 1,
          car: {
            id: 1,
            model: 'K5',
          },
          customer: {
            id: 1,
            name: '최효정',
          },
          user: {
            id: 1,
            name: '김연우',
          },
          meetings: [
            {
              date: '2024-02-22',
              alarms: ['2024-02-22T09:00:00.000Z', '2024-02-21T09:00:00.000Z'],
            },
          ],
          contractPrice: 2000000,
          resolutionDate: '2024-02-22T07:47:49.803Z',
          status: 'contractSuccessful',
        },
      ],
    },
    contractDraft: {
      totalItemCount: 1,
      data: [
        {
          id: 1,
          car: {
            id: 1,
            model: 'K5',
          },
          customer: {
            id: 1,
            name: '최효정',
          },
          user: {
            id: 1,
            name: '김연우',
          },
          meetings: [
            {
              date: '2024-02-22',
              alarms: ['2024-02-22T09:00:00.000Z', '2024-02-21T09:00:00.000Z'],
            },
          ],
          contractPrice: 2000000,
          resolutionDate: '2024-02-22T07:47:49.803Z',
          status: 'contractSuccessful',
        },
      ],
    },
    contractFailed: {
      totalItemCount: 1,
      data: [
        {
          id: 1,
          car: {
            id: 1,
            model: 'K5',
          },
          customer: {
            id: 1,
            name: '최효정',
          },
          user: {
            id: 1,
            name: '김연우',
          },
          meetings: [
            {
              date: '2024-02-22',
              alarms: ['2024-02-22T09:00:00.000Z', '2024-02-21T09:00:00.000Z'],
            },
          ],
          contractPrice: 2000000,
          resolutionDate: '2024-02-22T07:47:49.803Z',
          status: 'contractSuccessful',
        },
      ],
    },
    contractSuccessful: {
      totalItemCount: 1,
      data: [
        {
          id: 1,
          car: {
            id: 1,
            model: 'K5',
          },
          customer: {
            id: 1,
            name: '최효정',
          },
          user: {
            id: 1,
            name: '김연우',
          },
          meetings: [
            {
              date: '2024-02-22',
              alarms: ['2024-02-22T09:00:00.000Z', '2024-02-21T09:00:00.000Z'],
            },
          ],
          contractPrice: 2000000,
          resolutionDate: '2024-02-22T07:47:49.803Z',
          status: 'contractSuccessful',
        },
      ],
    },
  });
});
app.use('/contracts', testrouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running PORT ${PORT}`);
});
