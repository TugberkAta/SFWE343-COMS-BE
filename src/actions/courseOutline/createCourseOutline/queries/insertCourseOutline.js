const { submitQuery, getInsertId } = require("~root/lib/database");

const insertCourseOutline = ({
  courseId,
  termId,
  lecturerUserId,
  textbooksText,
  additionalReadingText,
  officeHours,
  officeCode,
  createdByUserId
}) => submitQuery`
  INSERT INTO course_outlines (
    course_id,
    term_id,
    lecturer_user_id,
    textbooks_text,
    additional_reading_text,
    office_hours,
    office_code,
    created_by_user_id
  ) VALUES (
    ${courseId},
    ${termId},
    ${lecturerUserId},
    ${textbooksText},
    ${additionalReadingText},
    ${officeHours},
    ${officeCode},
    ${createdByUserId}
  )
`;

module.exports = getInsertId(insertCourseOutline);
