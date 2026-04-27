const updateUserApproval = require("./queries/updateUserApproval");

const approveUser = async ({
  userId,
  userRoleId,
  userTypeId,
  approvedStatus
}) => {
  await updateUserApproval({ userId, userRoleId, userTypeId, approvedStatus });
  return { success: true };
};

module.exports = approveUser;
