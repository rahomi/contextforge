const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AIMessage extends Model {
    static associate(models) {
      AIMessage.belongsTo(models.AIConversation, { foreignKey: 'conversation_id', as: 'conversation' });
    }
  }

  AIMessage.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    conversation_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ai_conversations',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'assistant', 'system'),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tokens_used: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    is_streaming: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'AIMessage',
    tableName: 'ai_messages',
    underscored: true,
    indexes: [
      { fields: ['conversation_id'] },
      { fields: ['role'] },
      { fields: ['created_at'] }
    ]
  });

  return AIMessage;
};