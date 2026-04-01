const fetchUsersWithNoRole = require("~root/actions/users/fetchUsersWithNoRole");
const handleAPIError = require("~root/utils/handleAPIError");

const getUsersWithNoRole = async (req, res) => {
  try {
    const { users } = await fetchUsersWithNoRole();
    return res.status(200).send({ users });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = getUsersWithNoRole;
