const insertOutlineLearningOutcomes = require("~root/actions/courseOutline/createOutlineLearningOutcomes/queries/insertOutlineLearningOutcomes");
const deleteOutlineLearningOutcomes = require("./queries/deleteOutlineLearningOutcomes");

const patchOutlineLearningOutcomes = async ({
  outlineId,
  learningOutcomes
}) => {
  if (learningOutcomes === undefined) {
    return {};
  }

  await deleteOutlineLearningOutcomes({ outlineId });
  const cloMap = {};
  for (const [index, clo] of learningOutcomes.entries()) {
    const cloId = await insertOutlineLearningOutcomes({
      outlineId,
      cloNumber: clo.cloNumber === undefined ? index + 1 : clo.cloNumber,
      statement: clo.statement || clo.description || ""
    });
    cloMap[clo.cloNumber] = cloId;
  }
  return cloMap;
};

module.exports = patchOutlineLearningOutcomes;
