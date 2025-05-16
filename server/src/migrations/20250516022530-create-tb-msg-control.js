'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tb_msg_control', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      nr_telefone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      texto: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      data_gravacao: {
        type: Sequelize.DATE,
        allowNull: false
      },
      data_envio: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tb_msg_control');
  }
};

