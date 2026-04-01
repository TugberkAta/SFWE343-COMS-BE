const { submitQuery } = require("~root/lib/database");

const updateUserApproval = ({
  userId,
  userRoleId,
  approvedStatus
}) => submitQuery`
  UPDATE users
  SET
    user_role_id = ${userRoleId},
    approved = ${approvedStatus}
  WHERE user_id = ${userId}
`;

module.exports = updateUserApproval;
