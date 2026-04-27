const selectProgramIdByCourseId = require("./queries/selectProgramIdByCourseId");
const upsertProgramLearningOutcome = require("./queries/upsertProgramLearningOutcome");

const createProgramLearningOutcomes = async ({
  courseId,
  programLearningOutcomes
}) => {
  if (
    !Array.isArray(programLearningOutcomes) ||
    programLearningOutcomes.length === 0
  ) {
    return;
  }

  const programId = await selectProgramIdByCourseId(courseId);
  if (!programId) {
    return;
  }

  for (const [index, plo] of programLearningOutcomes.entries()) {
    await upsertProgramLearningOutcome({
      programId,
      ploNumber: plo.ploNumber === undefined ? index + 1 : plo.ploNumber,
      statement: plo.statement || ""
    });
  }
};

module.exports = createProgramLearningOutcomes;
