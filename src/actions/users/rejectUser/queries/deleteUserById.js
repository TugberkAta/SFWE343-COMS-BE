const { submitQuery } = require("~root/lib/database");

const deleteUserById = ({ userId }) => submitQuery`
  DELETE FROM users
  WHERE user_id = ${userId}
`;

module.exports = deleteUserById;
