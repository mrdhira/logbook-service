const models = require('../../models');

class User {
  constructor() {
    this.sql = models.sequelize;
    this.user = models.user;
  }

  async create (username, password, cookie, student_information = {}, employee_information = {}) {
    const sqlTrx = await this.sql.transaction();
    try {
      const user = await this.user.create({
        username,
        password,
        cookie,
        student_information,
        employee_information,
      });
      await sqlTrx.commit();
      return user;
    } catch (error) {
      await sqlTrx.rollback();
      console.log(error);
      throw error;
    }
  }

  async findOne (options) {
    try {
      const user = await this.user.findOne({ ...options });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update (id, options) {
    const sqlTrx = await this.sql.transaction();
    try {
      const user = await this.user.update({
        ...options,
      }, {
        where: { id },
      }, {
        transaction: { sqlTrx },
      });
      await sqlTrx.commit();
      return user;
    } catch (error) {
      await sqlTrx.rollback();
      console.log(error);
      throw error;
    }
  }
}

module.exports = new User();
