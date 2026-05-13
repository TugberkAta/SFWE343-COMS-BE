const { submitQuery } = require("~root/lib/database");

const updateUserTypeQuery = ({
  userTypeId,
  typeName,
  permissionsJson
}) => submitQuery`
  UPDATE user_types SET
    type_name = ${typeName},
    permissions_json = ${JSON.stringify(permissionsJson)}
  WHERE user_type_id = ${userTypeId}
`;

module.exports = updateUserTypeQuery;
