const updateOutlineStatus = require("~root/actions/outlineApproval/submitOutline/queries/updateOutlineStatus");
const updateWorkflowResubmit = require("./queries/updateWorkflowResubmit");
const insertResubmission = require("./queries/insertResubmission");

const resubmitOutline = async ({
  outlineId,
  submittedByUserId,
  submissionNote
}) => {
  await updateOutlineStatus({ outlineId, status: "in_review" });
  await updateWorkflowResubmit({ outlineId });
  await insertResubmission({ outlineId, submittedByUserId, submissionNote });
};

module.exports = resubmitOutline;
