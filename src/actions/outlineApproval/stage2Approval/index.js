const updateWorkflowStage2 = require("./queries/updateWorkflowStage2");
const insertApprovalComment = require("~root/actions/outlineApproval/stage1Review/queries/insertApprovalComment");
const updateOutlineStatus = require("~root/actions/outlineApproval/submitOutline/queries/updateOutlineStatus");

const stage2Approval = async ({
  outlineId,
  action,
  commentText,
  approverUserId
}) => {
  if (action === "approve") {
    await updateWorkflowStage2({
      outlineId,
      currentStage: "approved",
      approverUserId
    });
    await updateOutlineStatus({ outlineId, status: "approved" });
    await insertApprovalComment({
      outlineId,
      workflowStage: "stage_2_approval",
      commentType: "approval",
      commentText,
      createdByUserId: approverUserId
    });
  } else if (action === "reject") {
    await updateWorkflowStage2({
      outlineId,
      currentStage: "changes_requested",
      approverUserId
    });
    await updateOutlineStatus({ outlineId, status: "draft" });
    await insertApprovalComment({
      outlineId,
      workflowStage: "stage_2_approval",
      commentType: "rejection",
      commentText,
      createdByUserId: approverUserId
    });
  }
};

module.exports = stage2Approval;
