const { submitQuery, camelKeys } = require("~root/lib/database");

const selectUsersWithNoRole = () => submitQuery`
  SELECT
    first_name,
    last_name,
    email,
    created_at,
    user_role
  FROM users
  LEFT JOIN user_roles ON users.user_role_id = user_roles.user_role_id
  WHERE users.user_role_id IS NULL
`;

module.exports = camelKeys(selectUsersWithNoRole);
