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
const createOutlineAssistants = require("~root/actions/courseOutline/createOutlineAssistants");
const createProgramLearningOutcomes = require("~root/actions/courseOutline/createProgramLearningOutcomes");
const {
  startTransaction,
  commitTransaction,
  rollbackTransaction
} = require("~root/lib/database");
const handleAPIError = require("~root/utils/handleAPIError");
const postCourseOutlineSchema = require("./schemas/postCourseOutlineSchema");

const postCourseOutline = async (req, res) => {
  const {
    courseId,
    termId,
    lecturerUserId,
    assistantUserIds,
    textbooksText,
    additionalReadingText,
    officeHours,
    officeCode,
    createdByUserId,
    objectives,
    contentItems,
    learningOutcomes,
    weeklyTopics,
    policies,
    referenceLinks,
    workloadItems,
    evaluationItems,
    programLearningOutcomes
  } = req.body;
  const normalizedAssistantUserIds = Array.isArray(assistantUserIds)
    ? assistantUserIds
    : [];

  let transactionStarted = false;
  try {
    await postCourseOutlineSchema.validate(
      { learningOutcomes },
      { abortEarly: false }
    );

    await startTransaction();
    transactionStarted = true;

    const { outlineId } = await createCourseOutline({
      courseId,
      termId,
      lecturerUserId,
      textbooksText,
      additionalReadingText,
      officeHours,
      officeCode,
      createdByUserId
    });

    await createOutlineAssistants({
      outlineId,
      assistantUserIds: normalizedAssistantUserIds
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

    await createOutlinePolicies({ policies });
    await createOutlineReferenceLinks({ referenceLinks });
    await createProgramLearningOutcomes({ courseId, programLearningOutcomes });
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
