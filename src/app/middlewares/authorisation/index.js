const getUserPermissions = require("./queries/getUserRole");

const authorise = ({ permissions }) => async (req, res, next) => {
  const { userId } = req.user;
  const userInfo = await getUserPermissions({ userId });

  if (!userInfo) {
    return res.sendStatus(403);
  }

  const userPermissions = userInfo.permissionsJson || [];

  const hasPermission = permissions.every(permission =>
    userPermissions.includes(permission)
  );

  if (hasPermission) {
    return next();
  }

  return res.sendStatus(403);
};

module.exports = authorise;
