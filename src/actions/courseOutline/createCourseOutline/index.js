const insertCourseOutline = require("./queries/insertCourseOutline");

const createCourseOutline = async ({
  courseId,
  termId,
  lecturerUserId,
  assistantUserId,
  textbooksText,
  additionalReadingText,
  createdByUserId
}) => {
  const outlineId = await insertCourseOutline({
    courseId,
    termId,
    lecturerUserId,
    assistantUserId,
    textbooksText,
    additionalReadingText,
    createdByUserId
  });
  return { outlineId };
};

module.exports = createCourseOutline;
