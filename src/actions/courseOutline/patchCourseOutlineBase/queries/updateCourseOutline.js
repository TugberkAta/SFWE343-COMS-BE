const { submitQuery } = require("~root/lib/database");

const updateCourseOutline = ({
  outlineId,
  status,
  lecturerUserId,
  assistantUserId,
  aimsObjectivesText,
  contentText,
  textbooksText,
  additionalReadingText
}) => submitQuery`
  UPDATE course_outlines SET
    status = ${status},
    lecturer_user_id = ${lecturerUserId},
    assistant_user_id = ${assistantUserId},
    aims_objectives_text = ${aimsObjectivesText},
    content_text = ${contentText},
    textbooks_text = ${textbooksText},
    additional_reading_text = ${additionalReadingText}
  WHERE outline_id = ${outlineId}
`;

module.exports = updateCourseOutline;
