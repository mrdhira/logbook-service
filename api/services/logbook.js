const cheerio = require('cheerio');
const LogbookUtils = require('../utils/Logbook');
const FLAG = {
  HOME: 'Home',
  LEARNING_PLAN: 'Learning Plan',
  MONTHLY_REPORT: 'Monthly Report',
  INSERT: 'Insert',
  VIEW: 'View',
  CHAT: 'Chat',
  FORUM: 'Forum',
  FEEDBACK: 'Feedback',
  PROFILE: 'Profile',
};

class Logbook {
  constructor() {
    
  }

  async check(cookie) {
    try {
      const logbook = new LogbookUtils();
      logbook.jar = await this._setCookie(logbook, cookie);
      const base = await logbook.base();
      const $ = cheerio.load(base.body);
      const check = await this._check(
        $('.item.active').first().text()
      );
      return check;
    } catch (error) {
      throw error;
    }
  }

  async login (nim, password) {
    try {
      const logbook = new LogbookUtils();
      const getLogin = await logbook.getLogin();
      let $ = await cheerio.load(getLogin.body);

      const _token = await $('.ui.large.form.shadow.login-form input').attr('value');

      const postLogin = await logbook.postLogin(_token, nim, password);
      $ = await cheerio.load(postLogin.body);

      const errorMessage = await $('div .ui.red').html().trim().replace('&apos;', '\'');

      if (errorMessage !== 'Username doesn\'t exists' && errorMessage !== 'Password incorrect') {
        return {
          message: 'success',
          data: {
            cookie: postLogin.headers['set-cookie'],
          },
          error: false
        };
      } else {
        return {
          message: errorMessage,
          error: true
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async insert (cookie, clock_in, clock_out, activity, description) {
    const logbook = new LogbookUtils();
    logbook.jar = await this._setCookie(logbook, cookie);
    const getInsert = await logbook.getInsert();
    let $ = await cheerio.load(getInsert.body);

    const _token = await $('.ui.form input').first().attr('value');

    const postInsert = await logbook.postInsert(_token, clock_in, clock_out, activity, description);
    $ = await cheerio.load(postInsert.body);

    const successMessage = await $('.ui.success.message div.header').text().trim();

    if (successMessage) {
      return {
        message: successMessage,
        error: false,
      };
    } else {
      return {
        message: 'failed',
        error: true
      };
    }
  }

  // Private
  async _setCookie (logbook, cookie) {
    let setCookie = cookie;
    const jar = logbook.jar;
    jar.getCookies('https://industry.socs.binus.ac.id/learning-plan/');
    if (!(setCookie instanceof Array)) setCookie = [setCookie];
    setCookie.forEach( (cookie) => {
      jar.setCookie(cookie, 'https://industry.socs.binus.ac.id/learning-plan/');
    });
    return jar;
  }

  async _check (flag) {
    const flagList = Object.values(FLAG);
    const result = flagList.find( (flagL) => flagL == flag);
    if (!result) return false;
    return true;
  }
}

module.exports = new Logbook();
