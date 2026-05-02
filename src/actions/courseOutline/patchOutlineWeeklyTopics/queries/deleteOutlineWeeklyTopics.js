const { submitQuery } = require("~root/lib/database");

const deleteOutlineWeeklyTopics = ({ outlineId }) => submitQuery`
  DELETE FROM outline_weekly_topics WHERE outline_id = ${outlineId}
`;

module.exports = deleteOutlineWeeklyTopics;
