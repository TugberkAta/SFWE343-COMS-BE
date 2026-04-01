const selectUsersWithNoRole = require("./queries/selectUsersWithNoRole");

const fetchUsersWithNoRole = async () => {
  const users = await selectUsersWithNoRole();
  return { users };
};

module.exports = fetchUsersWithNoRole;
