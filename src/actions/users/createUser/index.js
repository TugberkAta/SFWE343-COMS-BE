const insertUser = require("./queries/insertUser");

const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  userRoleId
}) => {
  const user = await insertUser({
    firstName,
    lastName,
    email,
    password,
    userRoleId
  });

  return { user };
};

module.exports = createUser;
