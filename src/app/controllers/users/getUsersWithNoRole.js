const getUsersWithNoRole = async (req, res) => {
  try {
    res.status(200).json({
      message: "Users without role retrieved successfully",
      users: []
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users without role",
      error: error.message
    });
  }
};

module.exports = getUsersWithNoRole;
