const updateUserTypeQuery = require("./queries/updateUserTypeQuery");

const updateUserType = async ({ userTypeId, typeName, permissionsJson }) => {
  await updateUserTypeQuery({ userTypeId, typeName, permissionsJson });
};

module.exports = updateUserType;
