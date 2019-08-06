const Promise = require('bluebird');
const userService = require('../../../services/user');
const logbookService = require('../../../services/logbook');

/**
 * Cron job name
 * @type {string}
 */
const name = 'Refresh User Cookie';

/**
 * Rule definition for job scheduling (in UTC)
 * @type {cron} seconds rule supported
 */
const rule = '0 15 * * * *';
const tz = 'Asia/Jakarta';

const getAllUser = () => {
  return userService
    .findAll()
    .then((users) => users.filter((user) => user.cookie));
};

/**
 * The job that will be run
 * @type {function}
 */
const job = async () => {
  console.log(`CRON ${name} is running...`);
  try {
    const users = await getAllUser();

    await Promise.mapSeries(users, async (user) => {
      console.log(`Refresh cookie for: ${user.username}`);
      const check = await logbookService.check(JSON.parse(user.cookie));
      await userService.updateCookie(user.id, JSON.stringify(check.cookie));
    });

    console.log(`CRON ${name} is finish...`);
    return 'SUCCESS';
  } catch (error) {
    console.log(`CRON ${name} error when running...`);
    console.log(error);
    throw error;
  }
};

module.exports = {
  name,
  enable: true, /* Simple switch to enable/disable jobs */
  cronjob: { rule, job, tz }, /* export cronjob parts */
};
