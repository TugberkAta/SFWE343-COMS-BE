const insertOutlineEvaluationItems = require("./queries/insertOutlineEvaluationItems");

const createOutlineEvaluationItems = async ({ outlineId, evaluationItems }) => {
  const evalMap = {};
  for (const [index, item] of (evaluationItems || []).entries()) {
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

module.exports = createOutlineEvaluationItems;
