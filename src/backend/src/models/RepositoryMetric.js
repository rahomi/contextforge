const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RepositoryMetric extends Model {
    static associate(models) {
      RepositoryMetric.belongsTo(models.Repository, { foreignKey: 'repository_id', as: 'repository' });
    }
  }

  RepositoryMetric.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    repository_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'repositories',
        key: 'id'
      }
    },
    metric_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    metric_key: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    recorded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'RepositoryMetric',
    tableName: 'repository_metrics',
    underscored: true,
    indexes: [
      { fields: ['repository_id'] },
      { fields: ['metric_type'] },
      { fields: ['recorded_at'] }
    ]
  });

  return RepositoryMetric;
};
