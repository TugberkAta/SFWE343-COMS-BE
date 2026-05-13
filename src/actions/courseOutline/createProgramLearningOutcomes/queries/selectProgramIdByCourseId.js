const { submitQuery, getFirst } = require("~root/lib/database");

const selectProgramIdByCourseId = getFirst(
  courseId => submitQuery`
    SELECT program_id
    FROM courses
    WHERE course_id = ${courseId}
  `,
  "program_id"
);

module.exports = selectProgramIdByCourseId;
