"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class tb_sms_control extends Model {
    static associate(models) {
      // define association here, se precisar
    }
  }

  tb_sms_control.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nr_telefone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      texto: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      data_gravacao: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      data_envio: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "tb_sms_control",
      freezeTableName: true,
      timestamps: false,  // se não usar createdAt/updatedAt
    }
  );

  return tb_sms_control;
};

