const { submitQuery } = require("~root/lib/database");

const deleteOutlineWorkloadItems = ({ outlineId }) => submitQuery`
  DELETE FROM outline_workload_items WHERE outline_id = ${outlineId}
`;

module.exports = deleteOutlineWorkloadItems;
