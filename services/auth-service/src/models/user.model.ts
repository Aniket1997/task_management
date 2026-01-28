import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database';

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'vendor' | 'admin';
  phone: string | null;
  isActive: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'phone' | 'isActive'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'customer' | 'vendor' | 'admin';
  public phone!: string | null;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('customer', 'vendor', 'admin'),
      defaultValue: 'customer',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        user.password = await bcrypt.hash(user.password, 12);
      },
    },
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  }
);

export default User;
