const models = require('../../models');

class User {
  constructor() {
    this.sql = models.sequelize;
    this.user = models.user;
    this.logbook_history = models.insert_logbook_history;
  }

  async create (username, password, cookie, student_information = {}, employee_information = {}) {
    const sqlTrx = await this.sql.transaction();
    try {
      const create = await this.user.create({
        username,
        password,
        cookie,
        student_information,
        employee_information,
      });
      await sqlTrx.commit();
      return create;
    } catch (error) {
      await sqlTrx.rollback();
      throw error;
    }
  }

  async findOne (options) {
    try {
      const user = await this.user.findOne({ ...options });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findAll(options) {
    try {
      const users = await this.user.findAll({ ...options });
      return users;
    } catch (error) {
      throw error;
    }
  }

  async update (id, options) {
    const sqlTrx = await this.sql.transaction();
    try {
      const update = await this.user.update({
        ...options,
      }, {
        where: { id },
      }, {
        transaction: { sqlTrx },
      });
      await sqlTrx.commit();
      return update;
    } catch (error) {
      await sqlTrx.rollback();
      throw error;
    }
  }

  async createLogbookHistory(username, clock_in, clock_out, activity, description) {
    const sqlTrx = await this.sql.transaction();
    try {
      const create = await this.logbook_history({
        username,
        clock_in,
        clock_out,
        activity,
        description,
      });
      await sqlTrx.commit();
      return create;
    } catch (error) {
      await sqlTrx.rollback();
      throw error;
    }
  }
}

module.exports = new User();
