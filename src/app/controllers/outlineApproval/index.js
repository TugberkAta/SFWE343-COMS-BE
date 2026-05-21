const submitOutline = require("~root/actions/outlineApproval/submitOutline");
const stage1Review = require("~root/actions/outlineApproval/stage1Review");
const stage2Approval = require("~root/actions/outlineApproval/stage2Approval");
const resubmitOutline = require("~root/actions/outlineApproval/resubmitOutline");
const handleAPIError = require("~root/utils/handleAPIError");

const postSubmitOutline = async (req, res) => {
  const { outlineId } = req.params;
  try {
    await submitOutline({ outlineId });
    return res.send({ message: "Outline submitted for review." });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

const postStage1Review = async (req, res) => {
  const { outlineId } = req.params;
  const { action, commentText } = req.body;
  const { userId: reviewerUserId } = req.user;
  try {
    await stage1Review({ outlineId, action, commentText, reviewerUserId });
    return res.send({ message: `Outline ${action}d at stage 1.` });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

const postStage2Approval = async (req, res) => {
  const { outlineId } = req.params;
  const { action, commentText } = req.body;
  const { userId: approverUserId } = req.user;
  try {
    await stage2Approval({ outlineId, action, commentText, approverUserId });
    return res.send({ message: `Outline ${action}d at stage 2.` });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

const postResubmitOutline = async (req, res) => {
  const { outlineId } = req.params;
  const { submissionNote } = req.body;
  const { userId: submittedByUserId } = req.user;
  try {
    await resubmitOutline({ outlineId, submittedByUserId, submissionNote });
    return res.send({ message: "Outline resubmitted for review." });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = {
  postSubmitOutline,
  postStage1Review,
  postStage2Approval,
  postResubmitOutline
};
