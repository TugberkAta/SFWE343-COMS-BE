const getUsersWithRole = async (req, res) => {
  try {
    res.status(200).json({
      message: "Users with role retrieved successfully",
      users: []
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users with role",
      error: error.message
    });
  }
};

module.exports = getUsersWithRole;
