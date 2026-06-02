const {
  submitQuery,
  getInsertId,
  sqlValueOrNull
} = require("~root/lib/database");

const insertOutlineEvaluationItems = ({
  outlineId,
  itemOrder,
  name,
  category,
  count,
  weightPercent,
  notes
}) => submitQuery`
  INSERT INTO outline_evaluation_items (
    outline_id,
    item_order,
    name,
    category,
    \`count\`,
    weight_percent,
    notes
  ) VALUES (
    ${outlineId},
    ${itemOrder},
    ${name},
    ${category},
    ${count},
    ${weightPercent},
    ${sqlValueOrNull(notes)}
  )
`;

module.exports = getInsertId(insertOutlineEvaluationItems);
