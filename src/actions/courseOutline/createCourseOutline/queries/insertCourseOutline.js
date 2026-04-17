const { submitQuery, getInsertId } = require("~root/lib/database");

const insertCourseOutline = ({
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
}) => submitQuery`
  INSERT INTO course_outlines (
    course_id,
    term_id,
    version_no,
    status,
    lecturer_user_id,
    assistant_user_id,
    aims_objectives_text,
    content_text,
    textbooks_text,
    additional_reading_text,
    created_by_user_id
  ) VALUES (
    ${courseId},
    ${termId},
    ${versionNo},
    ${status},
    ${lecturerUserId},
    ${assistantUserId},
    ${aimsObjectivesText},
    ${contentText},
    ${textbooksText},
    ${additionalReadingText},
    ${createdByUserId}
  )
`;

module.exports = getInsertId(insertCourseOutline);
