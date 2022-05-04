'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tutee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tutee.init(
    {
      tuteeId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tuteeEmail: DataTypes.STRING,
      tuteeName: DataTypes.STRING,
      pwd: DataTypes.STRING,
      isTutor: DataTypes.BOOLEAN,
      tuteeProfile: DataTypes.STRING,
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
      modelName: 'Tutee',
    },
  );
  return Tutee;
};
