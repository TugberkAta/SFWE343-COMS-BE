const { submitQuery } = require("~root/lib/database");

const insertApprovalComment = ({
  outlineId,
  workflowStage,
  commentType,
  commentText,
  createdByUserId
}) => submitQuery`
  INSERT INTO outline_approval_comments (
    outline_id,
    workflow_stage,
    comment_type,
    comment_text,
    created_by_user_id
  ) VALUES (
    ${outlineId},
    ${workflowStage},
    ${commentType},
    ${commentText},
    ${createdByUserId}
  )
`;

module.exports = insertApprovalComment;
