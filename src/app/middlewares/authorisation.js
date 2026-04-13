module.exports = ({ roles }) => (req, res, next) => {
  console.log(" DEBUG - req.user:", req.user);
  console.log(" DEBUG - required roles:", roles);

  if (!req.user || !roles.includes(req.user.userRole)) {
    console.log(" Authorization FAILED");
    return res.status(403).json({ error: "Forbidden" });
  }

  console.log(" Authorization SUCCESS");
  return next();
};
