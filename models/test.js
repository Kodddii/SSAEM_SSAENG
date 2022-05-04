'use strict';
const {Model} = require('sequelize');
const {Sequelize} = require('.');
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
        type: DataTypes.BIGINT,
      },
      tutorEmail: {
        primaryKey: false,
        type: DataTypes.STRING,
        allowNull: false,
      },
      tutorName: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
      },
      pwd: {
        primaryKey: false,
        type: DataTypes.STRING,
        allowNull: false,
      },
      isTutor: {
        primaryKey: true,
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      userProfile: {
        primaryKey: false,
        type: DataTypes.STRING,
        allowNull: true,
      },
      tag: {
        primaryKey: false,
        type: DataTypes.STRING,
        allowNull: true,
      },
      language1: {
        primaryKey: false,
        type: DataTypes.STRING,
        allowNull: false,
      },
      language2: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: true,
      },
      language3: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: true,
      },
      comment: {
        primaryKey: false,
        type: DataTypes.STRING,
        allowNull: true,
      },
      contents: {
        primaryKey: false,
        type: DataTypes.STRING,
        allowNull: true,
      },
      startTime: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: true,
      },
      endTime: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: true,
      },
      //   created_at: {
      //     type: Sequelize.NOW,
      //   },
    },
    {
      sequelize,
      modelName: 'Tutor',
    },
  );
  return Tutor;
};
