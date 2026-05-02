const { submitQuery } = require("~root/lib/database");

const deleteOutlineObjectives = ({ outlineId }) => submitQuery`
  DELETE FROM outline_objectives WHERE outline_id = ${outlineId}
`;

module.exports = deleteOutlineObjectives;
