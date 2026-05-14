const updateUserApproval = require("./queries/updateUserApproval");

const approveUser = async ({ userId, userTypeId, approvedStatus }) => {
  await updateUserApproval({ userId, userTypeId, approvedStatus });
  return { success: true };
};

module.exports = approveUser;
