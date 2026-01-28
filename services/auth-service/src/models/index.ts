import sequelize from '../config/database';
import User from './user.model';
import Token from './token.model';

User.hasMany(Token, { foreignKey: 'userId', as: 'tokens' });
Token.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Token };
