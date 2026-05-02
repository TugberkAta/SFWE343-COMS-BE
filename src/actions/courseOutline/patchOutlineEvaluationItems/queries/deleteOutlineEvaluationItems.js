const { submitQuery } = require("~root/lib/database");

const deleteOutlineEvaluationItems = ({ outlineId }) => submitQuery`
  DELETE FROM outline_evaluation_items WHERE outline_id = ${outlineId}
`;

module.exports = deleteOutlineEvaluationItems;
