const getUsersWithRole = async (req, res) => {
  try {
    const users = await db.query(
      "SELECT userId, username, email, userRole FROM users WHERE userRole IS NOT NULL AND userRole != ''"
    );

    res.status(200).json({
      message: "Users with role retrieved successfully",
      users: users
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users with role",
      error: error.message
    });
  }
};

module.exports = getUsersWithRole;
