const patchApprovedUser = require("~root/actions/users/patchApprovedUser");
const handleAPIError = require("~root/utils/handleAPIError");
const patchUserWithRoleSchema = require("./schemas/patchUserWithRoleSchema");

const patchUserWithRole = async (req, res) => {
  const { userId: currentUserId } = req.user;
  const targetUserId = parseInt(req.params.userId, 10);
  const { userTypeId, approved } = req.body;

  if (currentUserId === targetUserId) {
    return res
      .status(400)
      .send({ message: "You cannot update your own account here." });
  }

  if (!Number.isInteger(targetUserId) || targetUserId < 1) {
    return res.status(400).send({ message: "Invalid user id." });
  }

  try {
    await patchUserWithRoleSchema.validate(
      { userTypeId, approved },
      { abortEarly: false, stripUnknown: true }
    );

    const { updated } = await patchApprovedUser({
      userId: targetUserId,
      userTypeId,
      approved
    });

    if (!updated) {
      return res.status(404).send({
        message: "No approved user found with that id, or nothing to update."
      });
    }

    return res.send({ message: "User updated successfully." });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = patchUserWithRole;
