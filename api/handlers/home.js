module.exports = {
  index: {
    handler: function (req, res) {
      return res.response('API Version 1.0').code(200);
    },
  },
  notFound: {
    handler: function (req, res) {
      return res.response({result: '404 Not Found'}).code(404);
    },
  },
};
