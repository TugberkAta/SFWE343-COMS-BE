const { submitQuery, getInsertId } = require("~root/lib/database");

const insertOutlineLearningOutcomes = ({
  outlineId,
  cloNumber,
  domain,
  statement
}) => submitQuery`
  INSERT INTO outline_learning_outcomes (
    outline_id,
    clo_number,
    domain,
    statement
  ) VALUES (
    ${outlineId},
    ${cloNumber},
    ${domain},
    ${statement}
  )
`;

module.exports = getInsertId(insertOutlineLearningOutcomes);
