'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Record.belongsTo(models.User, {foreignKey: 'userId'}),
      Record.belongsTo(models.Category, {foreignKey: 'categoryId'})
    }
  }
  Record.init({
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    amount: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Record',
    tableName:'Records'
  });
  return Record;
};