const insertCourseOutline = require("./queries/insertCourseOutline");

const createCourseOutline = async ({
  courseId,
  termId,
  lecturerUserId,
  textbooksText,
  additionalReadingText,
  createdByUserId
}) => {
  const outlineId = await insertCourseOutline({
    courseId,
    termId,
    lecturerUserId,
    textbooksText,
    additionalReadingText,
    createdByUserId
  });
  return { outlineId };
};

module.exports = createCourseOutline;
