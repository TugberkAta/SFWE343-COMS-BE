const { submitQuery, getInsertId } = require("~root/lib/database");

const insertUserType = ({ typeName, permissionsJson }) => submitQuery`
  INSERT INTO user_types (
    type_name,
    permissions_json
  ) VALUES (
    ${typeName},
    ${JSON.stringify(permissionsJson)}
  )
`;

module.exports = getInsertId(insertUserType);
