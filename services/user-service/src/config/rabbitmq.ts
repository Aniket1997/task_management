import amqplib, { Channel, Connection, ConsumeMessage } from 'amqplib';
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

export const consumeMessage = async (
  queue: string,
  handler: (data: unknown) => Promise<void>
): Promise<void> => {
  if (!channel) return;
  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, async (msg: ConsumeMessage | null) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString());
        await handler(data);
        channel!.ack(msg);
      } catch (err) {
        logger.error(`Error processing message from ${queue}:`, err);
        channel!.nack(msg, false, false);
      }
    }
  });
};
