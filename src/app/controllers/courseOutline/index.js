const createCourseOutline = require("~root/actions/courseOutline/createCourseOutline");
const createOutlineObjectives = require("~root/actions/courseOutline/createOutlineObjectives");
const createOutlineContentItems = require("~root/actions/courseOutline/createOutlineContentItems");
const createOutlineLearningOutcomes = require("~root/actions/courseOutline/createOutlineLearningOutcomes");
const createOutlineWeeklyTopics = require("~root/actions/courseOutline/createOutlineWeeklyTopics");
const createOutlineWeeklyTopicClos = require("~root/actions/courseOutline/createOutlineWeeklyTopicClos");
const createOutlinePolicies = require("~root/actions/courseOutline/createOutlinePolicies");
const createOutlineReferenceLinks = require("~root/actions/courseOutline/createOutlineReferenceLinks");
const createOutlineWorkloadItems = require("~root/actions/courseOutline/createOutlineWorkloadItems");
const createOutlineEvaluationItems = require("~root/actions/courseOutline/createOutlineEvaluationItems");
const createOutlineEvaluationItemClos = require("~root/actions/courseOutline/createOutlineEvaluationItemClos");
const {
  startTransaction,
  commitTransaction,
  rollbackTransaction
} = require("~root/lib/database");
const handleAPIError = require("~root/utils/handleAPIError");

const postCourseOutline = async (req, res) => {
  const {
    courseId,
    termId,
    lecturerUserId,
    assistantUserId,
    textbooksText,
    additionalReadingText,
    createdByUserId,
    objectives,
    contentItems,
    learningOutcomes,
    weeklyTopics,
    policies,
    referenceLinks,
    workloadItems,
    evaluationItems
  } = req.body;

  let transactionStarted = false;
  try {
    await startTransaction();
    transactionStarted = true;

    const { outlineId } = await createCourseOutline({
      courseId,
      termId,
      lecturerUserId,
      assistantUserId,
      textbooksText,
      additionalReadingText,
      createdByUserId
    });

    await createOutlineObjectives({ outlineId, objectives });
    await createOutlineContentItems({ outlineId, contentItems });

    const cloMap = await createOutlineLearningOutcomes({
      outlineId,
      learningOutcomes
    });

    const topicMap = await createOutlineWeeklyTopics({
      outlineId,
      weeklyTopics
    });
    await createOutlineWeeklyTopicClos({ topicMap, cloMap });

    await createOutlinePolicies({ outlineId, policies });
    await createOutlineReferenceLinks({ outlineId, referenceLinks });
    await createOutlineWorkloadItems({ outlineId, workloadItems });

    const evalMap = await createOutlineEvaluationItems({
      outlineId,
      evaluationItems
    });
    await createOutlineEvaluationItemClos({ evalMap, cloMap });

    await commitTransaction();
    transactionStarted = false;
    return res.status(201).send({ outlineId });
  } catch (err) {
    if (transactionStarted) {
      await rollbackTransaction();
    }
    return handleAPIError(res, err);
  }
};

module.exports = { postCourseOutline };
