const { submitQuery, camelKeys } = require("~root/lib/database");

const selectUserRoles = () => submitQuery`
    SELECT
        user_role_id,
        user_role
    FROM user_roles
`;

module.exports = camelKeys(selectUserRoles);
