const { submitQuery, camelKeys } = require("~root/lib/database");

const selectUserTypes = () => submitQuery`
  SELECT
    user_type_id,
    type_name,
    permissions_json
  FROM user_types
  ORDER BY type_name ASC
`;

module.exports = camelKeys(selectUserTypes);
