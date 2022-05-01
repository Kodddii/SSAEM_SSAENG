'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      userId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userEmail: DataTypes.STRING,
      userName: DataTypes.STRING,
      pwd: DataTypes.STRING,
      isTutor: DataTypes.STRING,
      userProfile: DataTypes.STRING,
      tag: DataTypes.STRING,
      contents: DataTypes.STRING,
      startTime: DataTypes.STRING,
      endTime: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
