'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tutees', {
      tuteeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tuteeEmail: {
        type: Sequelize.STRING,
      },
      tuteeName: {
        type: Sequelize.STRING,
      },
      pwd: {
        type: Sequelize.STRING,
      },
      isTutor: {
        type: Sequelize.BOOLEAN,
      },
      tuteeProfile: {
        type: Sequelize.STRING,
      },
      tag: {
        type: Sequelize.STRING,
      },
      language1: {
        type: Sequelize.STRING,
      },
      language2: {
        type: Sequelize.STRING,
      },
      language3: {
        type: Sequelize.STRING,
      },
      comment: {
        type: Sequelize.STRING,
      },
      contents: {
        type: Sequelize.STRING,
      },
      startTime: {
        type: Sequelize.STRING,
      },
      endTime: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Tutees');
  },
};
