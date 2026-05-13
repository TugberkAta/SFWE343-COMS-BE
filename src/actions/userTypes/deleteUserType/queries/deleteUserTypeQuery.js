const { submitQuery } = require("~root/lib/database");

const deleteUserTypeQuery = ({ userTypeId }) => submitQuery`
  DELETE FROM user_types WHERE user_type_id = ${userTypeId}
`;

module.exports = deleteUserTypeQuery;
