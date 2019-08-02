const handlers = require('../../handlers');

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/',
      config: handlers.home.index,
    },
    // Not Found
    {
      method: 'GET',
      path: '/{path*}',
      config: handlers.home.notFound,
    },
  ],
};