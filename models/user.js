'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    cookie: DataTypes.JSONB,
    student_information: DataTypes.JSONB,
    employee_information: DataTypes.JSONB
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};