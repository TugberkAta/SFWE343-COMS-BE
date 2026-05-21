const updateOutlineStatus = require("./queries/updateOutlineStatus");
const insertApprovalWorkflow = require("./queries/insertApprovalWorkflow");

const submitOutline = async ({ outlineId }) => {
  await updateOutlineStatus({ outlineId, status: "in_review" });
  await insertApprovalWorkflow({ outlineId });
};

module.exports = submitOutline;
