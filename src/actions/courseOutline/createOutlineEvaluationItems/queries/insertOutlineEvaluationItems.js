const { submitQuery, getInsertId } = require("~root/lib/database");

const insertOutlineEvaluationItems = ({
  outlineId,
  itemOrder,
  name,
  category,
  weightPercent,
  notes
}) => submitQuery`
  INSERT INTO outline_evaluation_items (
    outline_id,
    item_order,
    name,
    category,
    weight_percent,
    notes
  ) VALUES (
    ${outlineId},
    ${itemOrder},
    ${name},
    ${category},
    ${weightPercent},
    ${notes}
  )
`;

module.exports = getInsertId(insertOutlineEvaluationItems);
