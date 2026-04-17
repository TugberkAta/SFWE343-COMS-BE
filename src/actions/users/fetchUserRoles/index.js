const selectUserRoles = require("./queries/selectUserRoles");

const fetchUserRoles = async () => {
  const userRoles = await selectUserRoles();

  const filterAdminUserRoles = userRoles.filter(role => role.userRoleId !== 1);

  return { userRoles: filterAdminUserRoles };
};

module.exports = fetchUserRoles;
