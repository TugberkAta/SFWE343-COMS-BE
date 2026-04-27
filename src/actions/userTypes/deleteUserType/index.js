const deleteUserTypeQuery = require("./queries/deleteUserTypeQuery");

const deleteUserType = async ({ userTypeId }) => {
  await deleteUserTypeQuery({ userTypeId });
};

module.exports = deleteUserType;
