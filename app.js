const glue = require('@hapi/glue');
const moment = require('moment');
const { manifest } = require('./config/manifest');

const start = async () => {
  try {
    const server = await glue.compose(manifest, {
      relativeTo: __dirname,
    });

    // add logging on response
    server.events.on('response', (req, res) => {
      console.log('\n\nEVENT LOG...');
      console.log(
        `${req.info.remoteAddress}, ${moment().format(
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
