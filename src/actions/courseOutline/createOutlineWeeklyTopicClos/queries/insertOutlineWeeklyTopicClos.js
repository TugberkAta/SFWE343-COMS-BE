const { submitQuery } = require("~root/lib/database");

const insertOutlineWeeklyTopicClos = ({ weeklyTopicId, cloId }) => submitQuery`
  INSERT INTO outline_weekly_topic_clos (
    weekly_topic_id,
    clo_id
  ) VALUES (
    ${weeklyTopicId},
    ${cloId}
  )
`;

module.exports = insertOutlineWeeklyTopicClos;
