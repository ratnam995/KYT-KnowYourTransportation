module.exports = (sequelize, DataTypes) => {
  const MomentHistory = sequelize.define(
    'MomentHistory',
    {
      start: { type: DataTypes.STRING },
      end: { type: DataTypes.STRING },
      analysis_type: { type: DataTypes.STRING },
      moment_definition_id: { type: DataTypes.STRING },
      duration: { type: DataTypes.DECIMAL }
    },
    {
      underscored: true,
    }
  );

  return MomentHistory;
};
