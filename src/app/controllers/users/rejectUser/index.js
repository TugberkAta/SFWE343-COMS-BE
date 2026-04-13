const rejectUser = require("~root/actions/users/rejectUser");
const handleAPIError = require("~root/utils/handleAPIError");
const postRejectUserSchema = require("./schemas/postRejectUserSchema");

const postRejectUser = async (req, res) => {
  const { userId: currentUserId } = req.user;
  const { userId } = req.body;

  if (currentUserId === userId) {
    return res.status(400).send({ message: "You cannot reject yourself." });
  }

  try {
    await postRejectUserSchema.validate({ userId }, { abortEarly: false });

    await rejectUser({ userId });
    return res.send({ message: "User rejected successfully." });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = postRejectUser;
