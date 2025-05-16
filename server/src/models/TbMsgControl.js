'use strict';
module.exports = (sequelize, DataTypes) => {
  const TbMsgControl = sequelize.define('tb_msg_control', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nr_telefone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data_gravacao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data_envio: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'tb_msg_control',
    timestamps: false
  });

  return TbMsgControl;
};

