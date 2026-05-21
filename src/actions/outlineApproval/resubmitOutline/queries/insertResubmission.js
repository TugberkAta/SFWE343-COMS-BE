const { submitQuery } = require("~root/lib/database");

const insertResubmission = ({
  outlineId,
  submittedByUserId,
  submissionNote
}) => submitQuery`
  INSERT INTO outline_resubmissions (
    outline_id,
    submitted_by_user_id,
    submission_note
  ) VALUES (
    ${outlineId},
    ${submittedByUserId},
    ${submissionNote}
  )
`;

module.exports = insertResubmission;
