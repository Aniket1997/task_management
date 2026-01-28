import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  phone: string | null;
  address: Address | null;
  isActive: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'phone' | 'address' | 'isActive'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public role!: 'customer' | 'vendor' | 'admin';
  public phone!: string | null;
  public address!: Address | null;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    },
    role: {
      type: DataTypes.ENUM('customer', 'vendor', 'admin'),
      defaultValue: 'customer',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
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
  }
);

export default User;
