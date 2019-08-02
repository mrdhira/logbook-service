'use strict';
module.exports = (sequelize, DataTypes) => {
  const insert_logbook_history = sequelize.define('insert_logbook_history', {
    username: DataTypes.STRING,
    clock_in: DataTypes.STRING,
    clock_out: DataTypes.STRING,
    activity: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  insert_logbook_history.associate = function(models) {
    // associations can be defined here
  };
  return insert_logbook_history;
};