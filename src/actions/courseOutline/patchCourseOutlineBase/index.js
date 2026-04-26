const updateCourseOutline = require("./queries/updateCourseOutline");

const patchCourseOutlineBase = async ({
  outlineId,
  status,
  termId,
  lecturerUserId,
  textbooksText,
  additionalReadingText
}) => {
  await updateCourseOutline({
    outlineId,
    status,
    termId,
    lecturerUserId,
    textbooksText,
    additionalReadingText
  });
};

module.exports = patchCourseOutlineBase;
