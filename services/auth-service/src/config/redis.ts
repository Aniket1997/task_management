import Redis from 'ioredis';
import logger from '../../../../shared/utils/logger';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
});

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err) => logger.error('Redis error:', err));

export default redis;
