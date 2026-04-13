const getUsersNoRole = async (req, res) => {
  try {
    const users = await db.query(
      "SELECT userId, username, email FROM users WHERE userRole IS NULL OR userRole = ''"
    );

    res.status(200).json({
      message: "Users without role retrieved successfully",
      users: users
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users without role",
      error: error.message
    });
  }
};

module.exports = getUsersNoRole;
