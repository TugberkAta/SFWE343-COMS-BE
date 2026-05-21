const updateWorkflowStage1 = require("./queries/updateWorkflowStage1");
const insertApprovalComment = require("./queries/insertApprovalComment");
const updateOutlineStatus = require("~root/actions/outlineApproval/submitOutline/queries/updateOutlineStatus");

const stage1Review = async ({
  outlineId,
  action,
  commentText,
  reviewerUserId
}) => {
  if (action === "approve") {
    await updateWorkflowStage1({
      outlineId,
      currentStage: "stage_2_approval",
      reviewerUserId
    });
    await insertApprovalComment({
      outlineId,
      workflowStage: "stage_1_review",
      commentType: "approval",
      commentText,
      createdByUserId: reviewerUserId
    });
  } else if (action === "reject") {
    await updateWorkflowStage1({
      outlineId,
      currentStage: "changes_requested",
      reviewerUserId
    });
    await updateOutlineStatus({ outlineId, status: "draft" });
    await insertApprovalComment({
      outlineId,
      workflowStage: "stage_1_review",
      commentType: "changes_requested",
      commentText,
      createdByUserId: reviewerUserId
    });
  }
};

module.exports = stage1Review;
