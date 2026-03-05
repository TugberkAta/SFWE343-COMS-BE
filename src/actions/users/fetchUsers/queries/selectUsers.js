const { submitQuery, camelKeys } = require("~root/lib/database");

const selectUsers = () => submitQuery`
    SELECT 
        first_name,
        last_name,
        email,
        created_at,
        user_role
    FROM users
    LEFT JOIN user_roles ON users.user_role_id = user_roles.user_role_id
`;

module.exports = camelKeys(selectUsers);
