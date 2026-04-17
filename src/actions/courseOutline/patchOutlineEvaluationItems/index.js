const insertOutlineEvaluationItems = require("~root/actions/courseOutline/createOutlineEvaluationItems/queries/insertOutlineEvaluationItems");
const deleteOutlineEvaluationItems = require("./queries/deleteOutlineEvaluationItems");

const patchOutlineEvaluationItems = async ({ outlineId, evaluationItems }) => {
  await deleteOutlineEvaluationItems({ outlineId });
  const evalMap = {};
  for (const item of evaluationItems) {
    const evaluationItemId = await insertOutlineEvaluationItems({
      outlineId,
      itemOrder: item.itemOrder,
      name: item.name,
      category: item.category,
      weightPercent: item.weightPercent,
      notes: item.notes
    });
    evalMap[item.itemOrder] = { evaluationItemId, clos: item.clos };
  }
  return evalMap;
};

module.exports = patchOutlineEvaluationItems;
