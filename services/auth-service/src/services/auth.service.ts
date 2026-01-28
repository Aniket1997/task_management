import { User, Token } from '../models';
import redis from '../config/redis';
import { publishMessage } from '../config/rabbitmq';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';
import { AppError } from '../../../../shared/middleware/errorHandler';
import { QUEUES } from '../../../../shared/constants';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const generateTokens = async (user: User): Promise<{ accessToken: string; refreshToken: string }> => {
  const tokenPayload: TokenPayload = { id: user.id, email: user.email, role: user.role };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshTokenStr = generateRefreshToken(tokenPayload);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await Token.create({ userId: user.id, token: refreshTokenStr, expiresAt });

  return { accessToken, refreshToken: refreshTokenStr };
};

export const register = async (input: RegisterInput): Promise<AuthResult> => {
  const existing = await User.scope('withPassword').findOne({ where: { email: input.email } });
  if (existing) throw new AppError('Email already registered', 409);

  const user = await User.create(input);

  await publishMessage(QUEUES.USER_CREATED, { userId: user.id, email: user.email, role: user.role });

  const tokens = await generateTokens(user);
  return { user, ...tokens };
};

export const login = async ({ email, password }: LoginInput): Promise<AuthResult> => {
  const user = await User.scope('withPassword').findOne({ where: { email } });
  if (!user || !user.isActive) throw new AppError('Invalid email or password', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const tokens = await generateTokens(user);
  return { user, ...tokens };
};

export const logout = async (accessToken: string, userId: string): Promise<void> => {
  await redis.set(`bl:${accessToken}`, '1', 'EX', 900);
  await Token.destroy({ where: { userId } });
};

export const refreshToken = async (token: string): Promise<AuthResult> => {
  const payload = verifyRefreshToken(token);

  const storedToken = await Token.findOne({ where: { token, userId: payload.id } });
  if (!storedToken) throw new AppError('Invalid refresh token', 401);

  await storedToken.destroy();

  const user = await User.findByPk(payload.id);
  if (!user || !user.isActive) throw new AppError('User not found or inactive', 401);

  const tokens = await generateTokens(user);
  return { user, ...tokens };
};
