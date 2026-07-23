const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class KnowledgeDocument extends Model {
    static associate(models) {
      KnowledgeDocument.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      KnowledgeDocument.belongsToMany(models.DocumentTag, { through: 'document_tags', foreignKey: 'document_id', as: 'tags' });
      KnowledgeDocument.hasMany(models.DocumentVersion, { foreignKey: 'document_id', as: 'versions' });
      KnowledgeDocument.hasMany(models.AIEmbedding, { foreignKey: 'document_id', as: 'embeddings' });
    }
  }

  KnowledgeDocument.init({
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
    title: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    current_version: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'KnowledgeDocument',
    tableName: 'knowledge_documents',
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['category'] },
      { fields: ['status'] },
      { fields: ['title'] }
    ]
  });

  return KnowledgeDocument;
};
