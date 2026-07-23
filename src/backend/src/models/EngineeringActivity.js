const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class EngineeringActivity extends Model {
    static associate(models) {
      EngineeringActivity.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      EngineeringActivity.belongsTo(models.Repository, { foreignKey: 'repository_id', as: 'repository' });
    }
  }

  EngineeringActivity.init({
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
    activity_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    occurred_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    severity: {
      type: DataTypes.ENUM('info', 'warning', 'error', 'critical'),
      defaultValue: 'info'
    }
  }, {
    sequelize,
    modelName: 'EngineeringActivity',
    tableName: 'engineering_activities',
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['repository_id'] },
      { fields: ['activity_type'] },
      { fields: ['occurred_at'] },
      { fields: ['severity'] }
    ]
  });

  return EngineeringActivity;
};