const patchCourseOutlineBase = require("~root/actions/courseOutline/patchCourseOutlineBase");
const patchOutlineObjectives = require("~root/actions/courseOutline/patchOutlineObjectives");
const patchOutlineContentItems = require("~root/actions/courseOutline/patchOutlineContentItems");
const patchOutlineLearningOutcomes = require("~root/actions/courseOutline/patchOutlineLearningOutcomes");
const patchOutlineWeeklyTopics = require("~root/actions/courseOutline/patchOutlineWeeklyTopics");
const patchOutlineWeeklyTopicClos = require("~root/actions/courseOutline/patchOutlineWeeklyTopicClos");
const patchOutlinePolicies = require("~root/actions/courseOutline/patchOutlinePolicies");
const patchOutlineReferenceLinks = require("~root/actions/courseOutline/patchOutlineReferenceLinks");
const patchOutlineWorkloadItems = require("~root/actions/courseOutline/patchOutlineWorkloadItems");
const patchOutlineEvaluationItems = require("~root/actions/courseOutline/patchOutlineEvaluationItems");
const patchOutlineEvaluationItemClos = require("~root/actions/courseOutline/patchOutlineEvaluationItemClos");
const patchOutlineAssistants = require("~root/actions/courseOutline/patchOutlineAssistants");
const handleAPIError = require("~root/utils/handleAPIError");

const patchCourseOutline = async (req, res) => {
  const { outlineId } = req.params;
  const {
    status,
    termId,
    lecturerUserId,
    assistantUserIds,
    textbooksText,
    additionalReadingText,
    objectives,
    contentItems,
    learningOutcomes,
    weeklyTopics,
    policies,
    referenceLinks,
    workloadItems,
    evaluationItems
  } = req.body;
  const normalizedAssistantUserIds = Array.isArray(assistantUserIds)
    ? assistantUserIds
    : undefined;

  try {
    await patchCourseOutlineBase({
      outlineId,
      status,
      termId,
      lecturerUserId,
      textbooksText,
      additionalReadingText
    });
    await patchOutlineAssistants({
      outlineId,
      assistantUserIds: normalizedAssistantUserIds
    });

    await patchOutlineObjectives({ outlineId, objectives });
    await patchOutlineContentItems({ outlineId, contentItems });

    const cloMap = await patchOutlineLearningOutcomes({
      outlineId,
      learningOutcomes
    });

    const topicMap = await patchOutlineWeeklyTopics({
      outlineId,
      weeklyTopics
    });
    await patchOutlineWeeklyTopicClos({ topicMap, cloMap });

    await patchOutlinePolicies({ outlineId, policies });
    await patchOutlineReferenceLinks({ outlineId, referenceLinks });
    await patchOutlineWorkloadItems({ outlineId, workloadItems });

    const evalMap = await patchOutlineEvaluationItems({
      outlineId,
      evaluationItems
    });
    await patchOutlineEvaluationItemClos({ evalMap, cloMap });

    return res.send({ outlineId });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = { patchCourseOutline };
