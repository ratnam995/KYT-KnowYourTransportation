module.exports = (sequelize, DataTypes) => {
  const EventHistory = sequelize.define(
    'EventHistory',
    {
      type: { type: DataTypes.STRING, allowNull: false },
      start: { type: DataTypes.BIGINT, allowNull: false },
      end: { type: DataTypes.BIGINT, allowNull: false },
      analysis_type: { type: DataTypes.STRING, allowNull: false },
      mode: { type: DataTypes.STRING, allowNull: false },
      distance: { type: DataTypes.BIGINT, allowNull: false },
      trajectory: { type: DataTypes.JSONB, allowNull: false },
      duration: { type: DataTypes.DECIMAL, allowNull: false }
    },
    {
      underscored: true,
    }
  );

  return EventHistory;
};
