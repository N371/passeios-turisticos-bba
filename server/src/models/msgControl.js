module.exports = (sequelize, DataTypes) => {
  const MsgControl = sequelize.define('msg_control', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nr_telefone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    data_gravacao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data_envio: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'tb_msg_control', // Nome exato da tabela no banco
    timestamps: false
  });

  return MsgControl;
};
