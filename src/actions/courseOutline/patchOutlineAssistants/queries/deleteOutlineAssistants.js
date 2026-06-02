const { submitQuery } = require("~root/lib/database");

const deleteOutlineAssistants = ({ outlineId }) => submitQuery`
  DELETE FROM outline_assistants
  WHERE outline_id = ${outlineId}
`;

module.exports = deleteOutlineAssistants;
