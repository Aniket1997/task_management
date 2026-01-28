import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { sequelize } from './models';
import { connectRabbitMQ } from './config/rabbitmq';
import userRoutes from './routes/user.routes';
import { errorHandler } from '../../../shared/middleware/errorHandler';
import logger from '../../../shared/utils/logger';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (msg: string) => logger.info(msg.trim()) } }));

app.use('/api/users', userRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'user-service' }));

app.use(errorHandler);

const start = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    logger.info('Database synced');

    await connectRabbitMQ();

    app.listen(PORT, () => logger.info(`User service running on port ${PORT}`));
  } catch (err) {
    logger.error('Failed to start user service:', err);
    process.exit(1);
  }
};

start();
