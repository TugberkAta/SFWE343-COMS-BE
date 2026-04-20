const insertOutlineWorkloadItems = require("./queries/insertOutlineWorkloadItems");

const createOutlineWorkloadItems = async ({ outlineId, workloadItems }) => {
  for (const [index, item] of (workloadItems || []).entries()) {
    await insertOutlineWorkloadItems({
      outlineId,
      itemOrder: item.itemOrder === undefined ? index + 1 : item.itemOrder,
      activityType: item.activityType || item.activity || "",
      learningActivitiesWeeks:
        item.learningActivitiesWeeks === undefined
          ? 0
          : item.learningActivitiesWeeks,
      durationHours:
        item.durationHours === undefined ? item.hours || 0 : item.durationHours
    });
  }
};

module.exports = createOutlineWorkloadItems;
