const { submitQuery } = require("~root/lib/database");

const deleteOutlinePolicies = () => submitQuery`
  DELETE FROM outline_policies
`;

module.exports = deleteOutlinePolicies;
