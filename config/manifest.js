const blipp = require('blipp');
const api = require('../api');

const manifest = {
  server: {
    host: process.env.NODE_HOST || '127.0.0.1',
    port: process.env.NODE_PORT || '8000',
    routes: {
      cors: true,
    },
    router: {
      stripTrailingSlash: true,
    },
  },
  register: {
    plugins: [

    ].concat(api.map((a) => {
      return {
        plugin: a,
        routes: {
          prefix: `/${a.path}`,
        },
      };
    })),
  },
};


if ((process.env.NODE_ENV || 'development') !== 'production') {
  manifest.register.plugins.push( blipp );
}

module.exports = { manifest };
