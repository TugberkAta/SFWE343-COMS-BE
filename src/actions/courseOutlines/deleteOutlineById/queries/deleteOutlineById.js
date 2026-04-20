const { submitQuery } = require("~root/lib/database");

const deleteOutlineById = ({ outlineId }) => submitQuery`
  DELETE FROM course_outlines
  WHERE outline_id = ${outlineId}
`;

module.exports = deleteOutlineById;
