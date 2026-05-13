const insertCourseOutline = require("./queries/insertCourseOutline");

const createCourseOutline = async ({
  courseId,
  termId,
  lecturerUserId,
  textbooksText,
  additionalReadingText,
  officeHours,
  officeCode,
  createdByUserId
}) => {
  const outlineId = await insertCourseOutline({
    courseId,
    termId,
    lecturerUserId,
    textbooksText,
    additionalReadingText,
    officeHours,
    officeCode,
    createdByUserId
  });
  return { outlineId };
};

module.exports = createCourseOutline;
