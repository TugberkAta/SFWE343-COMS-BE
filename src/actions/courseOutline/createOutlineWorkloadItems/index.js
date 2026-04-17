const insertOutlineWorkloadItems = require("./queries/insertOutlineWorkloadItems");

const createOutlineWorkloadItems = async ({ outlineId, workloadItems }) => {
  for (const item of workloadItems) {
    await insertOutlineWorkloadItems({
      outlineId,
      itemOrder: item.itemOrder,
      activityType: item.activityType,
      learningActivitiesWeeks: item.learningActivitiesWeeks,
      durationHours: item.durationHours
    });
  }
};

module.exports = createOutlineWorkloadItems;
