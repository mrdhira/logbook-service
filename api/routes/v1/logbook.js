const handlers = require('../../handlers');

module.exports = {
  name: 'logbook',
  routes: [
    {
      method: 'POST',
      path: '/check',
      config: handlers.logbook.check,
    },
    {
      method: 'POST',
      path: '/login',
      config: handlers.logbook.login,
    },
    {
      method: 'POST',
      path: '/insert',
      config: handlers.logbook.insert,
    },
    // Not Found
    {
      method: 'GET',
      path: '/{path*}',
      config: handlers.home.notFound,
    },
  ],
};
