const fetchUsersWithRole = require("~root/actions/users/fetchUsersWithRole");
const handleAPIError = require("~root/utils/handleAPIError");

const getUsersWithRole = async (req, res) => {
  try {
    const { users } = await fetchUsersWithRole();
    return res.status(200).send({ users });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = getUsersWithRole;
