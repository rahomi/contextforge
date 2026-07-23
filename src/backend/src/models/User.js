const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Repository, { foreignKey: 'user_id', as: 'repositories' });
      User.hasMany(models.KnowledgeDocument, { foreignKey: 'user_id', as: 'documents' });
      User.hasMany(models.AIConversation, { foreignKey: 'user_id', as: 'conversations' });
      User.hasMany(models.EngineeringActivity, { foreignKey: 'user_id', as: 'activities' });
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    github_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    github_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    github_token_encrypted: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {
        theme: 'system',
        language: 'en',
        notifications: true,
        analysis_interval: 'daily'
      }
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['github_id'] }
    ]
  });

  return User;
};
