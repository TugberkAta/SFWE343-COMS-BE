const { submitQuery } = require("~root/lib/database");

const updateUserApproval = ({
  userId,
  userRoleId,
  userTypeId,
  approvedStatus
}) => submitQuery`
  UPDATE users
  SET
    user_role_id = ${userRoleId},
    user_type_id = ${userTypeId},
    approved = ${approvedStatus}
  WHERE user_id = ${userId}
`;

module.exports = updateUserApproval;
