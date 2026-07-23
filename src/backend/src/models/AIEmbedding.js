const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AIEmbedding extends Model {
    static associate(models) {
      AIEmbedding.belongsTo(models.KnowledgeDocument, { foreignKey: 'document_id', as: 'document' });
    }
  }

  AIEmbedding.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    document_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'knowledge_documents',
        key: 'id'
      }
    },
    content_chunk: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    embedding: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    chunk_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    chunk_count: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'AIEmbedding',
    tableName: 'ai_embeddings',
    underscored: true,
    indexes: [
      { fields: ['document_id'] },
      { fields: ['model'] }
    ]
  });

  return AIEmbedding;
};