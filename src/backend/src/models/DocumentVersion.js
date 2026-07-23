const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DocumentVersion extends Model {
    static associate(models) {
      DocumentVersion.belongsTo(models.KnowledgeDocument, { foreignKey: 'document_id', as: 'document' });
    }
  }

  DocumentVersion.init({
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
    version: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    change_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'DocumentVersion',
    tableName: 'document_versions',
    underscored: true,
    indexes: [
      { fields: ['document_id'] },
      { fields: ['document_id', 'version'], unique: true }
    ]
  });

  return DocumentVersion;
};