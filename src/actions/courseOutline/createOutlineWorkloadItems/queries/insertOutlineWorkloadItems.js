const { submitQuery } = require("~root/lib/database");

const insertOutlineWorkloadItems = ({
  outlineId,
  itemOrder,
  activityType,
  learningActivitiesWeeks,
  durationHours
}) => submitQuery`
  INSERT INTO outline_workload_items (
    outline_id,
    item_order,
    activity_type,
    learning_activities_weeks,
    duration_hours
  ) VALUES (
    ${outlineId},
    ${itemOrder},
    ${activityType},
    ${learningActivitiesWeeks},
    ${durationHours}
  )
`;

module.exports = insertOutlineWorkloadItems;
