require('dotenv').config();

const glue = require('@hapi/glue');
const moment = require('moment-timezone');
const { manifest } = require('./config/manifest');
const cron = require('./api/controllers/cron');

const start = async () => {
  try {
    const server = await glue.compose(manifest, {
      relativeTo: __dirname,
    });

    if (process.env.ENABLE_CRON) {
      await cron.start();
    };

    // add logging on response
    server.events.on('response', (req, res) => {
      console.log('\n\nEVENT LOG...');
      console.log(
        `${req.info.remoteAddress}, ${moment().tz('Asia/Jakarta').format(
          'YYYY-MM-DD HH:mm:ss:SSS'
        )}: ${req.method.toUpperCase()} ${req.url.pathname} --> ${req.response.statusCode}`);
    });

    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
