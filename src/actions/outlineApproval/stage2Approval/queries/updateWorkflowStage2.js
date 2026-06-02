const { submitQuery } = require("~root/lib/database");

const updateWorkflowStage2 = ({
  outlineId,
  currentStage,
  approverUserId
}) => submitQuery`
  UPDATE outline_approval_workflows
  SET
    current_stage = ${currentStage},
    stage_2_approver_user_id = ${approverUserId},
    stage_2_approved_at = NOW(),
    final_approved_at = NOW()
  WHERE outline_id = ${outlineId}
`;

module.exports = updateWorkflowStage2;
