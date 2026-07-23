const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AIConversation extends Model {
    static associate(models) {
      AIConversation.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      AIConversation.belongsTo(models.Repository, { foreignKey: 'repository_id', as: 'repository' });
      AIConversation.hasMany(models.AIMessage, { foreignKey: 'conversation_id', as: 'messages' });
    }
  }

  AIConversation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    repository_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'repositories',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    context: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    message_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('active', 'archived', 'deleted'),
      defaultValue: 'active'
    },
    last_activity_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'AIConversation',
    tableName: 'ai_conversations',
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['repository_id'] },
      { fields: ['status'] },
      { fields: ['last_activity_at'] }
    ]
  });

  return AIConversation;
};
