module.exports = ({ roles }) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.userRole)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};
