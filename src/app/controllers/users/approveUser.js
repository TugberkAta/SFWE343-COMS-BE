module.exports = async (req, res) => {
  if (!req.user || req.user.userRole !== "Admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  return res.status(200).json({ message: "User approved successfully" });
};
