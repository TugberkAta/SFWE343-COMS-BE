const { submitQuery, camelKeys } = require("~root/lib/database");

const selectUsers = () => submitQuery`
  SELECT
    users.first_name,
    users.last_name,
    users.email,
    users.created_at,
    user_roles.user_role,
    user_types.user_type_id,
    user_types.type_name,
    user_types.permissions_json
  FROM users
  LEFT JOIN user_roles ON users.user_role_id = user_roles.user_role_id
  LEFT JOIN user_types ON users.user_type_id = user_types.user_type_id
`;

module.exports = camelKeys(selectUsers);
