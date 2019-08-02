module.exports = {
  // 200
  USER_AUTHORIZED: {
    meta: {
      code: 200,
      msg: 'User authorized.',
      error: false,
    },
  },
  LOGIN_SUCCESS: {
    meta: {
      code: 200,
      msg: 'Login successfully',
      error: false,
    },
  },
  INSERT_SUCCESS(message) {
    return  {
      meta: {
        coe: 200,
        msg: message,
        error: false,
      },
    };
  },
  // 400
  USER_NOT_AUTHORIZED: {
    meta: {
      code: 401,
      msg: 'User not authorized.',
      error: true,
    },
  },
  USER_NOT_FOUND: {
    meta: {
      code: 404,
      msg: 'User not found.',
      error: true,
    },
  },
  LOGIN_FAILED(message) {
    return {
      meta: {
        code: 404,
        msg: message,
        error: true,
      },
    };
  },
  INSERT_FAILED: {
    meta: {
      code: 424,
      msg: 'Failed on industry.',
      error: true,
    },
  },
};
