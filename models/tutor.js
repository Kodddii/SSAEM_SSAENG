'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tutor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tutor.init(
    {
      tutorId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tutorEmail: DataTypes.STRING,
      tutorName: DataTypes.STRING,
      pwd: DataTypes.STRING,
      isTutor: DataTypes.BOOLEAN,
      tutorProfile: DataTypes.STRING,
      tag: DataTypes.STRING,
      language1: DataTypes.STRING,
      language2: DataTypes.STRING,
      language3: DataTypes.STRING,
      comment: DataTypes.STRING,
      contents: DataTypes.STRING,
      startTime: DataTypes.STRING,
      endTime: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Tutor',
    },
  );
  return Tutor;
};
