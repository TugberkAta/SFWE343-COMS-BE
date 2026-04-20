const updateCourseOutline = require("./queries/updateCourseOutline");

const patchCourseOutlineBase = async ({
  outlineId,
  status,
  termId,
  lecturerUserId,
  assistantUserId,
  textbooksText,
  additionalReadingText
}) => {
  await updateCourseOutline({
    outlineId,
    status,
    termId,
    lecturerUserId,
    assistantUserId,
    textbooksText,
    additionalReadingText
  });
};

module.exports = patchCourseOutlineBase;
