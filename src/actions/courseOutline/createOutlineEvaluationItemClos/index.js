const insertOutlineEvaluationItemClos = require("./queries/insertOutlineEvaluationItemClos");

const createOutlineEvaluationItemClos = async ({ evalMap, cloMap }) => {
  for (const itemOrder of Object.keys(evalMap)) {
    const { evaluationItemId, clos } = evalMap[itemOrder];
    for (const clo of clos) {
      const cloId = cloMap[clo.cloNumber];
      if (cloId) {
        await insertOutlineEvaluationItemClos({ evaluationItemId, cloId });
      }
    }
  }
};

module.exports = createOutlineEvaluationItemClos;
