const { submitQuery } = require("~root/lib/database");

const updateWorkflowResubmit = ({ outlineId }) => submitQuery`
  UPDATE outline_approval_workflows
  SET
    current_stage = 'stage_1_review',
    submission_count = submission_count + 1
  WHERE outline_id = ${outlineId}
`;

module.exports = updateWorkflowResubmit;
