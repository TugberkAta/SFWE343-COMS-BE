const { submitQuery } = require("~root/lib/database");

const upsertProgramLearningOutcome = ({ programId, ploNumber, statement }) =>
  submitQuery`
    INSERT INTO program_learning_outcomes (
      program_id,
      plo_number,
      statement
    ) VALUES (
      ${programId},
      ${ploNumber},
      ${statement}
    )
    ON DUPLICATE KEY UPDATE
      statement = VALUES(statement)
  `;

module.exports = upsertProgramLearningOutcome;
