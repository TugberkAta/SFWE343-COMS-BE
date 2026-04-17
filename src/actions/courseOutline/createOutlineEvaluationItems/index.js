const insertOutlineEvaluationItems = require("./queries/insertOutlineEvaluationItems");

const createOutlineEvaluationItems = async ({ outlineId, evaluationItems }) => {
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

module.exports = createOutlineEvaluationItems;
