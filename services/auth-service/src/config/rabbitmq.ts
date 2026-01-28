import amqplib, { Channel, Connection } from 'amqplib';
import logger from '../../../../shared/utils/logger';

let channel: Channel | null = null;

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    const connection: Connection = await amqplib.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost:5672'
    );
    channel = await connection.createChannel();
    logger.info('RabbitMQ connected');

    connection.on('error', (err) => logger.error('RabbitMQ connection error:', err));
    connection.on('close', () => {
      logger.warn('RabbitMQ connection closed, reconnecting...');
      setTimeout(connectRabbitMQ, 5000);
    });
  } catch (err) {
    logger.error('RabbitMQ connection failed:', err);
    setTimeout(connectRabbitMQ, 5000);
  }
};

export const getChannel = (): Channel | null => channel;

export const publishMessage = async (queue: string, message: object): Promise<void> => {
  if (!channel) return;
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
};
