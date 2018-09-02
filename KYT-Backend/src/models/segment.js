module.exports = (sequelize, DataTypes) => {
    const Segment = sequelize.define(
      'Segment',
      {
        idTag : { type: DataTypes.STRING, allowNull: false },
        display_name : { type: DataTypes.STRING, allowNull: false },
        description : { type: DataTypes.STRING, allowNull: false }
      },
      {
        underscored: true,
      }
    );
  
    return Segment;
  };
  