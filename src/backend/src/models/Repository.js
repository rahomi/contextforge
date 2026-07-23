const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Repository extends Model {
    static associate(models) {
      Repository.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Repository.hasMany(models.RepositoryAnalysis, { foreignKey: 'repository_id', as: 'analyses' });
      Repository.hasMany(models.RepositoryMetric, { foreignKey: 'repository_id', as: 'metrics' });
      Repository.hasMany(models.EngineeringActivity, { foreignKey: 'repository_id', as: 'activities' });
      Repository.hasMany(models.AIConversation, { foreignKey: 'repository_id', as: 'conversations' });
    }
  }

  Repository.init({
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
    github_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    github_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    default_branch: {
      type: DataTypes.STRING(100),
      defaultValue: 'main'
    },
    language: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    languages: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    topics: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    is_private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_fork: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    size_kb: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    stars_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    forks_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    open_issues_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    health_score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    analysis_config: {
      type: DataTypes.JSONB,
      defaultValue: {
        auto_analyze: true,
        interval: 'daily',
        analyze_dependencies: true,
        analyze_security: true
      }
    },
    last_analyzed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_synced_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Repository',
    tableName: 'repositories',
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['full_name'] },
      { fields: ['user_id', 'full_name'], unique: true }
    ]
  });

  return Repository;
};
