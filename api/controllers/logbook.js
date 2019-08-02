const logbookService = require('../services/logbook');
const userService = require('../services/user');
const Meta = require('../shared/Meta');

const check = async (req, res) => {
  const { nim } = req.payload;
  try {
    const user = await userService.findOne({ where: { username: nim } });
    if (!user) {
      return res.response(Meta.USER_NOT_FOUND).code(404);
    } else {
      const check = await logbookService.check(JSON.parse(user.cookie));
      if (!check) {
        return res.response(Meta.USER_NOT_AUTHORIZED).code(401);
      } else {
        return res.response(Meta.USER_AUTHORIZED).code(200);
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const login = async (req, res) => {
  const { nim, password } = req.payload;
  try {
    const login = await logbookService.login(nim, password);
    if (login.error) {
      return res.response(Meta.LOGIN_FAILED(login.message)).code(401);
    } else {
      const user = await userService.findOne({ where: { username: nim } });
      if (!user) {
        await userService.create(nim, password, JSON.stringify(login.data.cookie), {}, {});
      } else {
        await userService.update(user.id, {
          cookie: JSON.stringify(login.data.cookie),
        });
      }
      return res.response(Meta.LOGIN_SUCCESS).code(200);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const insert = async (req, res) => {
  const { nim, clock_in, clock_out, activity, description } = req.payload;
  try {
    const user = await userService.findOne({ where: { username: nim } });
    if (!user) {
      return res.response(Meta.USER_NOT_FOUND).code(401);
    } else {
      const insert = await logbookService.insert(JSON.parse(user.cookie), clock_in, clock_out, activity, description);
      if (insert.error) {
        return res.response(Meta.INSERT_FAILED).code(424);
      } else {
        return res.response(Meta.INSERT_SUCCESS(insert.message)).code(200);
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  check,
  login,
  insert,
};
