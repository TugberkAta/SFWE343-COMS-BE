const { submitQuery, sql, sqlReduce } = require("~root/lib/database");

const NO_UPDATE = Symbol("NO_UPDATE");

const updateCourseOutline = ({
  outlineId,
  status = NO_UPDATE,
  termId = NO_UPDATE,
  lecturerUserId = NO_UPDATE,
  textbooksText = NO_UPDATE,
  additionalReadingText = NO_UPDATE
}) => {
  const updates = [];

  if (status !== NO_UPDATE) {
    updates.push(sql`status = ${status}`);
  }

  if (termId !== NO_UPDATE) {
    updates.push(sql`term_id = ${termId}`);
  }

  if (lecturerUserId !== NO_UPDATE) {
    updates.push(sql`lecturer_user_id = ${lecturerUserId}`);
  }

  if (textbooksText !== NO_UPDATE) {
    updates.push(sql`textbooks_text = ${textbooksText}`);
  }

  if (additionalReadingText !== NO_UPDATE) {
    updates.push(sql`additional_reading_text = ${additionalReadingText}`);
  }

  if (updates.length !== 0) {
    return submitQuery`
      UPDATE
        course_outlines
      SET
        ${updates.reduce(sqlReduce)}
      WHERE
        outline_id = ${outlineId}
    `;
  }

  return Promise.resolve();
};

module.exports = updateCourseOutline;
