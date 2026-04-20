const insertOutlineEvaluationItemClos = require("~root/actions/courseOutline/createOutlineEvaluationItemClos/queries/insertOutlineEvaluationItemClos");

const patchOutlineEvaluationItemClos = async ({ evalMap, cloMap }) => {
  if (!evalMap || !cloMap) {
    return;
  }

  for (const itemOrder of Object.keys(evalMap)) {
    const { evaluationItemId, clos } = evalMap[itemOrder];
    const insertedCloIds = new Set();

    for (const clo of clos || []) {
      const cloKey =
        clo.cloNumber || clo.cloCode || (typeof clo === "string" ? clo : null);
      const cloId = cloMap[cloKey];

      if (cloId && !insertedCloIds.has(cloId)) {
        await insertOutlineEvaluationItemClos({ evaluationItemId, cloId });
        insertedCloIds.add(cloId);
      }
    }
  }
};

module.exports = patchOutlineEvaluationItemClos;
