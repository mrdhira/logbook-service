const Request = require('./Request');
const options = {
  baseUrl: 'https://industry.socs.binus.ac.id/learning-plan',
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
      const response = await this.Get('/auth/login', { jar: this.jar });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async postLogin(_token, username, password) {
    try {
      const form = { _token, username, password };
      const response = await this.Post('/auth/login', {
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
      const response = await this.Get('/student/log-book/insert', { jar: this.jar });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async postInsert(_token, clock_in, clock_out, activity, description) {
    try {
      const response = await this.Post('/student/log-book/insert', {
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

}

module.exports = Logbook;
