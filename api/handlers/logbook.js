const joi = require('@hapi/joi');
const logbookControllers = require('../controllers/logbook');

module.exports = {
  check: {
    tags: ['logbook'],
    handler: logbookControllers.check,
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: {
        nim: joi.string().length(10),
      },
    },
  },
  login: {
    tags: ['logbook'],
    handler: logbookControllers.login,
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: {
        nim: joi.string().length(10).required(),
        password: joi.string().required(),
      },
    },
  },
  insert: {
    tags: ['logbook'],
    handler: logbookControllers.insert,
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: {
        nim: joi.string().length(10).required(),
        clock_in: joi.string().required(),
        clock_out: joi.string().required(),
        activity: joi.string().required(),
        description: joi.string().required(),
      },
    },
  },
};
