const updateCourseOutline = require("./queries/updateCourseOutline");

const patchCourseOutlineBase = async ({
  outlineId,
  status,
  termId,
  lecturerUserId,
  textbooksText,
  additionalReadingText,
  officeHours,
  officeCode
}) => {
  await updateCourseOutline({
    outlineId,
    status,
    termId,
    lecturerUserId,
    textbooksText,
    additionalReadingText,
    officeHours,
    officeCode
  });
};

module.exports = patchCourseOutlineBase;
