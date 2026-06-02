const { submitQuery } = require("~root/lib/database");

const updateWorkflowStage1 = ({
  outlineId,
  currentStage,
  reviewerUserId
}) => submitQuery`
  UPDATE outline_approval_workflows
  SET
    current_stage = ${currentStage},
    stage_1_reviewer_user_id = ${reviewerUserId},
    stage_1_reviewed_at = NOW()
  WHERE outline_id = ${outlineId}
`;

module.exports = updateWorkflowStage1;
