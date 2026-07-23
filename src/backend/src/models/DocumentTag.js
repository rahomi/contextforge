const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DocumentTag extends Model {
    static associate(models) {
      DocumentTag.belongsToMany(models.KnowledgeDocument, { through: 'document_tags', foreignKey: 'tag_id', as: 'documents' });
    }
  }

  DocumentTag.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    color: {
      type: DataTypes.STRING(7),
      defaultValue: '#3b82f6'
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'DocumentTag',
    tableName: 'document_tags',
    underscored: true,
    indexes: [
      { fields: ['name'], unique: true }
    ]
  });

  return DocumentTag;
};
