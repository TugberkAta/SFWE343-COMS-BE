const { submitQuery, camelKeys } = require("~root/lib/database");

const selectCourses = () => submitQuery`
  SELECT
    c.course_id,
    c.program_id,
    c.code,
    c.name,
    c.language,
    c.course_level_text,
    c.category,
    c.theory_hours,
    c.tutorial_hours,
    c.lab_hours,
    c.local_credits,
    c.ects_credits,
    p.name AS program_name,
    p.department_id,
    d.name AS department_name,
    d.type AS department_type
  FROM courses c
  JOIN programs p ON p.program_id = c.program_id
  JOIN departments d ON d.department_id = p.department_id
  ORDER BY c.code ASC
`;

module.exports = camelKeys(selectCourses);
