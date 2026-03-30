const approveUser = require("~root/actions/users/approveUser");
const handleAPIError = require("~root/utils/handleAPIError");
const postApproveUserSchema = require("./schemas/postApproveUserSchema");

const postApproveUser = async (req, res) => {
  const { userId, userRoleId, approvedStatus } = req.body;

  const { error } = postApproveUserSchema.validate({
    userId,
    userRoleId,
    approvedStatus
  });
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  try {
    await approveUser({ userId, userRoleId, approvedStatus });
    res.send({ message: "User approval status updated successfully." });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postApproveUser;
