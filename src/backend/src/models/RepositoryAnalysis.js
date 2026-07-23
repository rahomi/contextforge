const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RepositoryAnalysis extends Model {
    static associate(models) {
      RepositoryAnalysis.belongsTo(models.Repository, { foreignKey: 'repository_id', as: 'repository' });
    }
  }

  RepositoryAnalysis.init({
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
    analysis_type: {
      type: DataTypes.ENUM('initial', 'scheduled', 'manual', 'webhook'),
      defaultValue: 'initial'
    },
    status: {
      type: DataTypes.ENUM('pending', 'running', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    results: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    health_score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    code_quality: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    dependencies: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    security_issues: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    structure: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    metrics: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration_ms: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'RepositoryAnalysis',
    tableName: 'repository_analyses',
    underscored: true,
    indexes: [
      { fields: ['repository_id'] },
      { fields: ['status'] },
      { fields: ['analysis_type'] }
    ]
  });

  return RepositoryAnalysis;
};
