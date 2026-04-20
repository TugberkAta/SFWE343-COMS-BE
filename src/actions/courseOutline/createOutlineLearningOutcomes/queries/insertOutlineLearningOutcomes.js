const { submitQuery, getInsertId } = require("~root/lib/database");

const insertOutlineLearningOutcomes = ({
  outlineId,
  cloNumber,
  statement
}) => submitQuery`
  INSERT INTO outline_learning_outcomes (
    outline_id,
    clo_number,
    statement
  ) VALUES (
    ${outlineId},
    ${cloNumber},
    ${statement}
  )
`;

module.exports = getInsertId(insertOutlineLearningOutcomes);
