const { submitQuery, camelKeys } = require("~root/lib/database");

const selectOutlines = () => submitQuery`
  SELECT
    co.outline_id,
    co.course_id,
    co.term_id,
    co.version_no,
    co.status,
    co.created_at,
    co.updated_at,
    c.code AS course_code,
    c.name AS course_name,
    c.program_id,
    p.name AS program_name,
    d.department_id,
    d.name AS department_name,
    t.academic_year,
    t.semester
  FROM course_outlines co
  JOIN courses c ON c.course_id = co.course_id
  JOIN programs p ON p.program_id = c.program_id
  JOIN departments d ON d.department_id = p.department_id
  JOIN terms t ON t.term_id = co.term_id
  ORDER BY co.updated_at DESC
`;

module.exports = camelKeys(selectOutlines);
