const insertUserType = require("./queries/insertUserType");

const createUserType = async ({ typeName, permissionsJson }) => {
  const userTypeId = await insertUserType({ typeName, permissionsJson });
  return { userTypeId };
};

module.exports = createUserType;
