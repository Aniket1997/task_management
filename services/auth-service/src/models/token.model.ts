import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TokenAttributes {
  id: string;
  userId: string;
  token: string;
  type: 'refresh';
  expiresAt: Date;
}

interface TokenCreationAttributes extends Optional<TokenAttributes, 'id' | 'type'> {}

class Token extends Model<TokenAttributes, TokenCreationAttributes> implements TokenAttributes {
  public id!: string;
  public userId!: string;
  public token!: string;
  public type!: 'refresh';
  public expiresAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Token.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('refresh'),
      defaultValue: 'refresh',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'tokens',
    timestamps: true,
  }
);

export default Token;
