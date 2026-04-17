const insertOutlineLearningOutcomes = require("~root/actions/courseOutline/createOutlineLearningOutcomes/queries/insertOutlineLearningOutcomes");
const deleteOutlineLearningOutcomes = require("./queries/deleteOutlineLearningOutcomes");

const patchOutlineLearningOutcomes = async ({
  outlineId,
  learningOutcomes
}) => {
  await deleteOutlineLearningOutcomes({ outlineId });
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

module.exports = patchOutlineLearningOutcomes;
