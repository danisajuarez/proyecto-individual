const { DataTypes } = require("sequelize");

module.exports = (Sequelize) => {
  const Team = Sequelize.define("Team", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Team;
};
