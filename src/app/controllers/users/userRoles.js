const userRoles = require("../../../constants/userRoles");

const getUserRoles = async (req, res) => {
  try {
    res.status(200).json({
      message: "User roles retrieved successfully",
      roles: userRoles
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user roles",
      error: error.message
    });
  }
};

module.exports = getUserRoles;
