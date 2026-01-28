import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import config from './config';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
}));

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

app.use(routes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(config.port, () => {
  console.log(`API Gateway running on port ${config.port}`);
});
