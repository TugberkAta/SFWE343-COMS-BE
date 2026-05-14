const patchApprovedUserQuery = require("./queries/patchApprovedUserQuery");

const patchApprovedUser = async ({ userId, userTypeId, approved }) => {
  const result = await patchApprovedUserQuery({ userId, userTypeId, approved });

  return { updated: result.affectedRows > 0 };
};

module.exports = patchApprovedUser;
