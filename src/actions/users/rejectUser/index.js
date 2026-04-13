const deleteUserById = require("./queries/deleteUserById");

const rejectUser = async ({ userId }) => {
  await deleteUserById({ userId });
  return { success: true };
};

module.exports = rejectUser;
