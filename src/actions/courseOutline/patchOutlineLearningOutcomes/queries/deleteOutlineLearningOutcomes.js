const { submitQuery } = require("~root/lib/database");

const deleteOutlineLearningOutcomes = ({ outlineId }) => submitQuery`
  DELETE FROM outline_learning_outcomes WHERE outline_id = ${outlineId}
`;

module.exports = deleteOutlineLearningOutcomes;
