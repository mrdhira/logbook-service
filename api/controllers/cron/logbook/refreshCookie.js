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

/**
 * The job that will be run
 * @type {function}
 */
const job = () => {
  console.log(`CRON ${name} is running...`);
  try {
    const users = await userService.findAll().filter((user) => user.cookie);
    users.forEach((user) => {
      console.log(`Refresh cookie for: ${user.username}`);
      const cookie = await logbookService.check(JSON.parse(user.cookie));
      await userService.update(user.id, { cookie: JSON.stringify(cookie) });
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
