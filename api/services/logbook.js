const cheerio = require('cheerio');
const moment = require('moment');
const LogbookUtils = require('../utils/Logbook');
const LOGBOOK = require('../constants/logbook');

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
      if (check) {
        return { cookie: base.headers['set-cookie'] }
      } else {
        return check;
      }
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
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async view (cookie) {
    const view = {};
    try {
      const logbook = new LogbookUtils();
      logbook.jar = await this._setCookie(logbook, cookie);
      const getLogbook = await logbook.getLogbook();
      let $ = await cheerio.load(getLogbook.body);
  
      const temp = [];

      await $('tbody tr').each(function(index, elem) {
        const date = (
          $(elem).find('.date').text().trim()
          && $(elem).find('.date').text().trim().split(' ')[1].replace(/\//g, '-')
        ) || '';
        const clock_in = $(elem).find('.clock-in').text().trim() || '';
        const clock_out = $(elem).find('.clock-in').text().trim() || '';
        const activity = $(elem).find('.activity').text().trim() || '';
        const description = $(elem).find('.description').text().trim() || '';
        const status = (
          $(elem).find('td').eq(5).text().trim().split('\n')
          || $(elem).find('td').eq(5).text().trim()
        ) || '';
        const link = (
          $(elem).find('td a').attr('href')
          && $(elem).find('td a').attr('href').trim()
        ) || '';
  
        // Ambil logbook yang bisa di edit
        const request = {};
        request.method = $(elem).find('td form').attr('method') || '';
        request.link = $(elem).find('td form').attr('action') || '';
        request._token = $(elem).find('td form input').eq(0).attr('value') || '';
        request.requested_date = $(elem).find('td form input').eq(1).attr('value') || '';
        
        // Buat pagination di front end
        const month = moment(date, 'DD-MM-YYYY').format('MMMM');

        // Cek soalnya keambil juga profile information yang ada di bawah view logbook
        if (date) {
          temp.push({
            date,
            clock_in,
            clock_out,
            activity,
            description,
            status,
            link,
            request,
            month,
          });
        }
      });

      const listOfMonth = [ ...new Set(temp.map((t) => t.month)) ];

      temp.forEach((t) => {
        const month = listOfMonth.find((m) => m === t.month);
        delete t.month;
        
        // Cek bulan itu sudah dibuatkan objectnya atau belom
        if (!view[month]) {
          view[month] = [];
        }
        view[month].push(t);
      });

      return view;
    } catch (error) {
      throw error;
    }
  }

  // Private
  _setCookie (logbook, cookie) {
    let setCookie = cookie;
    const jar = logbook.jar;
    jar.getCookies(LOGBOOK.BASE_URL);
    if (!(setCookie instanceof Array)) setCookie = [setCookie];
    setCookie.forEach( (cookie) => {
      jar.setCookie(cookie, LOGBOOK.BASE_URL);
    });
    return jar;
  }

  _check (flag) {
    const result = LOGBOOK.FLAG.find( (flagL) => flagL == flag);
    if (!result) return false;
    return true;
  }
}

module.exports = new Logbook();
