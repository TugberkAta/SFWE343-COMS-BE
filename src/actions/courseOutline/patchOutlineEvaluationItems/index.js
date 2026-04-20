const insertOutlineEvaluationItems = require("~root/actions/courseOutline/createOutlineEvaluationItems/queries/insertOutlineEvaluationItems");
const deleteOutlineEvaluationItems = require("./queries/deleteOutlineEvaluationItems");

const patchOutlineEvaluationItems = async ({ outlineId, evaluationItems }) => {
  if (evaluationItems === undefined) {
    return {};
  }

  await deleteOutlineEvaluationItems({ outlineId });
  const evalMap = {};
  for (const [index, item] of evaluationItems.entries()) {
    const itemOrder = item.itemOrder === undefined ? index + 1 : item.itemOrder;
    const evaluationItemId = await insertOutlineEvaluationItems({
      outlineId,
      itemOrder,
      name: item.name || item.title || "",
      category: item.category || "other",
      weightPercent:
        item.weightPercent === undefined
          ? item.weight || 0
          : item.weightPercent,
      notes: item.notes
    });
    evalMap[itemOrder] = { evaluationItemId, clos: item.clos || [] };
  }
  return evalMap;
};

module.exports = patchOutlineEvaluationItems;
