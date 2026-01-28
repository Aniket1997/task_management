import { User } from '../models';
import { AppError } from '../../../../shared/middleware/errorHandler';

interface GetAllUsersParams {
  page?: number;
  limit?: number;
  role?: string;
}

export const getProfile = async (userId: string) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const updateProfile = async (userId: string, data: Partial<{ name: string; phone: string; address: object }>) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 404);

  await user.update(data);
  return user;
};

export const getUserById = async (id: string) => {
  const user = await User.findByPk(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const getAllUsers = async ({ page = 1, limit = 20, role }: GetAllUsersParams) => {
  const where: Record<string, unknown> = {};
  if (role) where.role = role;

  const offset = (page - 1) * limit;
  const { rows: users, count: total } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return { users, total, page: Number(page), totalPages: Math.ceil(total / limit) };
};
