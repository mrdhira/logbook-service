const logbookService = require('../services/logbook');
const userService = require('../services/user');
const Meta = require('../shared/Meta');

const check = async (req, res) => {
  console.log('Logbook Controller - Check');
  console.log('NIM: ', req.payload.nim);
  const { nim } = req.payload;
  try {
    const user = await userService.findOne({ where: { username: nim } });
    console.log('User: ', user);
    if (!user) {
      console.log('Response: ', Meta.USER_NOT_FOUND);
      return res.response(Meta.USER_NOT_FOUND).code(404);
    } else {
      const check = await logbookService.check(JSON.parse(user.cookie));
      if (!check) {
        console.log('Response: ', Meta.USER_NOT_AUTHORIZED);
        return res.response(Meta.USER_NOT_AUTHORIZED).code(401);
      } else {
        console.log('Response: ', Meta.USER_AUTHORIZED);
        return res.response(Meta.USER_AUTHORIZED).code(200);
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const login = async (req, res) => {
  console.log('Logbook Controller - Login');
  console.log('NIM: ', req.payload.nim);
  const { nim, password } = req.payload;
  try {
    const login = await logbookService.login(nim, password);
    console.log('Login: ', login);
    if (login.error) {
      console.log('Response: ', Meta.LOGIN_FAILED(login.message));
      return res.response(Meta.LOGIN_FAILED(login.message)).code(401);
    } else {
      const user = await userService.findOne({ where: { username: nim } });
      console.log('User: ', user);
      if (!user) {
        await userService.create(nim, password, JSON.stringify(login.data.cookie), {}, {});
      } else {
        await userService.updateCookie(user.id, JSON.stringify(login.data.cookie));
      }
      console.log('Response: ', Meta.LOGIN_SUCCESS);
      return res.response(Meta.LOGIN_SUCCESS).code(200);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const insert = async (req, res) => {
  console.log('Logbook Controller - Insert');
  console.log('NIM: ', req.payload.nim);
  console.log('clock_in: ', req.payload.clock_in);
  console.log('clock_out: ', req.payload.clock_out);
  console.log('activity: ', req.payload.activity);
  console.log('description: ', req.payload.description);

  const { nim, clock_in, clock_out, activity, description } = req.payload;
  try {
    const user = await userService.findOne({ where: { username: nim } });
    console.log('User: ', user);
    if (!user) {
      console.log('Response: ', Meta.USER_NOT_FOUND);
      return res.response(Meta.USER_NOT_FOUND).code(401);
    } else {
      const insert = await logbookService.insert(JSON.parse(user.cookie), clock_in, clock_out, activity, description);
      console.log('Insert: ', insert);
      if (insert.error) {
        console.log('Response: ', Meta.INSERT_FAILED);
        return res.response(Meta.INSERT_FAILED).code(424);
      } else {
        await userService.createLogbookHistory(nim, clock_in, clock_out, activity, description);
        console.log('Response: ', Meta.INSERT_SUCCESS(insert.message));
        return res.response(Meta.INSERT_SUCCESS(insert.message)).code(200);
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const view = async (req, res) => {
  console.log('Logbook Controller - View');
  console.log('NIM: ', req.query.nim);
  const { nim } = req.query;
  try {
    const user = await userService.findOne({ where: { username: nim } });
    console.log('User: ', user);
    if (!user) {
      return res.response(Meta.USER_NOT_FOUND).code(401);
    } else {
      const logbook = await logbookService.view(JSON.parse(user.cookie));
      console.log('==========================');
      console.log('Logbook: ', logbook);
      console.log('==========================');
      return logbook;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  check,
  login,
  insert,
  view,
};
