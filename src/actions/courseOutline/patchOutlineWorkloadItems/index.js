const deleteOutlineWorkloadItems = require("./queries/deleteOutlineWorkloadItems");
const insertOutlineWorkloadItems = require("~root/actions/courseOutline/createOutlineWorkloadItems/queries/insertOutlineWorkloadItems");

const patchOutlineWorkloadItems = async ({ outlineId, workloadItems }) => {
  await deleteOutlineWorkloadItems({ outlineId });
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

module.exports = patchOutlineWorkloadItems;
