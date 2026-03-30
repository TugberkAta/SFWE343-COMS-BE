const updateUserApproval = require("./queries/updateUserApproval");

const approveUser = async ({ userId, userRoleId, approvedStatus }) => {
  await updateUserApproval({ userId, userRoleId, approvedStatus });
  return { success: true };
};

module.exports = approveUser;
