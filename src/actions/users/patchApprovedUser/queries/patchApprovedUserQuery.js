const { submitQuery } = require("~root/lib/database");

const patchApprovedUserQuery = ({ userId, userTypeId, approved }) => {
  if (userTypeId !== undefined && approved !== undefined) {
    return submitQuery`
      UPDATE users
      SET user_type_id = ${userTypeId}, approved = ${approved}
      WHERE user_id = ${userId} AND approved = TRUE
    `;
  }
  if (userTypeId !== undefined) {
    return submitQuery`
      UPDATE users
      SET user_type_id = ${userTypeId}
      WHERE user_id = ${userId} AND approved = TRUE
    `;
  }
  return submitQuery`
    UPDATE users
    SET approved = ${approved}
    WHERE user_id = ${userId} AND approved = TRUE
  `;
};

module.exports = patchApprovedUserQuery;
