const insertCourseOutline = require("./queries/insertCourseOutline");

const createCourseOutline = async ({
  courseId,
  termId,
  versionNo,
  status,
  lecturerUserId,
  assistantUserId,
  aimsObjectivesText,
  contentText,
  textbooksText,
  additionalReadingText,
  createdByUserId
}) => {
  const outlineId = await insertCourseOutline({
    courseId,
    termId,
    versionNo,
    status,
    lecturerUserId,
    assistantUserId,
    aimsObjectivesText,
    contentText,
    textbooksText,
    additionalReadingText,
    createdByUserId
  });
  return { outlineId };
};

module.exports = createCourseOutline;
