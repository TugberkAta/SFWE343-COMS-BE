const insertOutlineLearningOutcomes = require("./queries/insertOutlineLearningOutcomes");

const parseCloNumber = clo => {
  if (clo && typeof clo.cloNumber === "number") {
    return clo.cloNumber;
  }

  if (clo && typeof clo.cloCode === "string") {
    const match = clo.cloCode.match(/(\d+)/);
    if (match) {
      return Number(match[1]);
    }
  }

  return null;
};

const createOutlineLearningOutcomes = async ({
  outlineId,
  learningOutcomes
}) => {
  const cloMap = {};
  for (const [index, clo] of (learningOutcomes || []).entries()) {
    const parsedCloNumber = parseCloNumber(clo);
    const cloNumber = parsedCloNumber === null ? index + 1 : parsedCloNumber;
    const cloId = await insertOutlineLearningOutcomes({
      outlineId,
      cloNumber,
      statement: clo.statement || clo.description || ""
    });
    cloMap[cloNumber] = cloId;
    if (clo.cloCode) {
      cloMap[clo.cloCode] = cloId;
    }
  }
  return cloMap;
};

module.exports = createOutlineLearningOutcomes;
