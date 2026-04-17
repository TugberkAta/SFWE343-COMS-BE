const { submitQuery } = require("~root/lib/database");

const insertOutlineObjectives = ({
  outlineId,
  objectiveOrder,
  objectiveText
}) => submitQuery`
  INSERT INTO outline_objectives (
    outline_id,
    objective_order,
    objective_text
  ) VALUES (
    ${outlineId},
    ${objectiveOrder},
    ${objectiveText}
  )
`;

module.exports = insertOutlineObjectives;
