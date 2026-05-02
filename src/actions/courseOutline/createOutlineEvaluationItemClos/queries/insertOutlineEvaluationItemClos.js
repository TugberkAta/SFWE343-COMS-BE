const { submitQuery } = require("~root/lib/database");

const insertOutlineEvaluationItemClos = ({
  evaluationItemId,
  cloId
}) => submitQuery`
  INSERT INTO outline_evaluation_item_clos (
    evaluation_item_id,
    clo_id
  ) VALUES (
    ${evaluationItemId},
    ${cloId}
  )
`;

module.exports = insertOutlineEvaluationItemClos;
