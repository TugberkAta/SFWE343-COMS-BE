const updateCourseOutline = require("./queries/updateCourseOutline");

const patchCourseOutlineBase = async ({
  outlineId,
  status,
  lecturerUserId,
  assistantUserId,
  aimsObjectivesText,
  contentText,
  textbooksText,
  additionalReadingText
}) => {
  await updateCourseOutline({
    outlineId,
    status,
    lecturerUserId,
    assistantUserId,
    aimsObjectivesText,
    contentText,
    textbooksText,
    additionalReadingText
  });
};

module.exports = patchCourseOutlineBase;
