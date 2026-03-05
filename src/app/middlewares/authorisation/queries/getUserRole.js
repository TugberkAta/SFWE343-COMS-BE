const { submitQuery, getFirst } = require("~root/lib/database");

const getUserRole = ({ userId }) => submitQuery`
    SELECT user_role 
    FROM users
    LEFT JOIN user_roles ON users.user_role_id = user_roles.user_role_id
    WHERE users.user_id = ${userId}
`;

module.exports = getFirst(getUserRole, "user_role");
