module.exports = async (req, res) => {
  if (!req.user || req.user.userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  return res.status(200).json({ users: [] });
};
