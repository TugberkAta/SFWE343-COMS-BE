const { submitQuery } = require("~root/lib/database");

const updateOutlineStatus = ({ outlineId, status }) => submitQuery`
  UPDATE course_outlines
  SET status = ${status}
  WHERE outline_id = ${outlineId}
`;

module.exports = updateOutlineStatus;
