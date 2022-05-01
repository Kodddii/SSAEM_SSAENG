'use strict';

const {sequelize} = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userEmail: {
        type: Sequelize.STRING,
      },
      userName: {
        type: Sequelize.STRING,
      },
      pwd: {
        type: Sequelize.STRING,
      },
      isTutor: {
        type: Sequelize.STRING,
      },
      userProfile: {
        type: Sequelize.STRING,
      },
      tag: {
        type: Sequelize.STRING,
      },
      contents: {
        type: Sequelize.STRING,
      },
      startTime: {
        type: sequelize.STRING,
      },
      endTime: {
        type: sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
