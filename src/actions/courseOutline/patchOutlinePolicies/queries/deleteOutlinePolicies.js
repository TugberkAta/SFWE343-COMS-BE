const { submitQuery } = require("~root/lib/database");

const deleteOutlinePolicies = ({ outlineId }) => submitQuery`
  DELETE FROM outline_policies WHERE outline_id = ${outlineId}
`;

module.exports = deleteOutlinePolicies;
