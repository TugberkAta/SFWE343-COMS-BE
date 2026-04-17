const insertOutlineLearningOutcomes = require("./queries/insertOutlineLearningOutcomes");

const createOutlineLearningOutcomes = async ({
  outlineId,
  learningOutcomes
}) => {
  const cloMap = {};
  for (const clo of learningOutcomes) {
    const cloId = await insertOutlineLearningOutcomes({
      outlineId,
      cloNumber: clo.cloNumber,
      domain: clo.domain,
      statement: clo.statement
    });
    cloMap[clo.cloNumber] = cloId;
  }
  return cloMap;
};

module.exports = createOutlineLearningOutcomes;
