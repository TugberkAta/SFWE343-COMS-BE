const approveUser = require("~root/actions/users/approveUser");
const handleAPIError = require("~root/utils/handleAPIError");
const postApproveUserSchema = require("./schemas/postApproveUserSchema");

const postApproveUser = async (req, res) => {
  const { userId: currentUserId } = req.user;
  const { userId, userRoleId, approvedStatus } = req.body;

  if (currentUserId === userId) {
    return res
      .status(400)
      .send({ message: "You cannot update your own role." });
  }

  try {
    await postApproveUserSchema.validate(
      { userId, userRoleId, approvedStatus },
      { abortEarly: false }
    );

    await approveUser({ userId, userRoleId, approvedStatus });
    return res.send({ message: "User approval status updated successfully." });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = postApproveUser;
