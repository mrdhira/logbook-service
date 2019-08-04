const Request = require('./Request');
const LOGBOOK = require('../constants/logbook');
const options = {
  baseUrl: LOGBOOK.BASE_URL,
};

class Logbook extends Request {
  constructor() {
    super(options);
  }

  async base() {
    try {
      const response = await this.Get('/', { jar: this.jar } );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getLogin() {
    try {
      const response = await this.Get(LOGBOOK.LOGIN, { jar: this.jar });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async postLogin(_token, username, password) {
    try {
      const response = await this.Post(LOGBOOK.LOGIN, {
        jar: this.jar,
        followAllRedirects: true,
        form: {
          _token,
          username,
          password
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getInsert() {
    try {
      const response = await this.Get(LOGBOOK.INSERT, { jar: this.jar });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async postInsert(_token, clock_in, clock_out, activity, description) {
    try {
      const response = await this.Post(LOGBOOK.INSERT, {
        jar: this.jar,
        followAllRedirects: true,
        form: {
          _token,
          ['clock-in']: clock_in,
          ['clock-out']: clock_out,
          activity,
          description
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getLogbook() {
    try {
      const response = await this.Get(LOGBOOK.VIEW, { jar: this.jar });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Logbook;
