const selectUsersWithRole = require("./queries/selectUsersWithRole");

const fetchUsersWithRole = async () => {
  const users = await selectUsersWithRole();
  return { users };
};

module.exports = fetchUsersWithRole;
