"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class sms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  sms.init(
    {
      nome: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      telefone: {
        type: DataTypes.STRING(17),
        allowNull: false,
      },
      consentimento: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      data_cadastro: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "sms",
      freezeTableName: true,
    }
  );

  return sms;
};

