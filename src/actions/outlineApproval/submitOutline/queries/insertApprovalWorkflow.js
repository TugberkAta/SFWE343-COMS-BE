const { submitQuery, getInsertId } = require("~root/lib/database");

const insertApprovalWorkflow = ({ outlineId }) => submitQuery`
  INSERT INTO outline_approval_workflows (
    outline_id,
    current_stage,
    submission_count
  ) VALUES (
    ${outlineId},
    'stage_1_review',
    1
  )
`;

module.exports = getInsertId(insertApprovalWorkflow);
