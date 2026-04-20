const insertOutlineEvaluationItemClos = require("./queries/insertOutlineEvaluationItemClos");

const createOutlineEvaluationItemClos = async ({ evalMap, cloMap }) => {
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

module.exports = createOutlineEvaluationItemClos;
