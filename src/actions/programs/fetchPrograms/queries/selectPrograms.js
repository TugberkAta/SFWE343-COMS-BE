const { submitQuery, camelKeys } = require("~root/lib/database");

const selectPrograms = () => submitQuery`
  SELECT
    p.program_id,
    p.department_id,
    p.name,
    p.language,
    d.type AS department_type,
    d.name AS department_name
  FROM programs p
  JOIN departments d ON d.department_id = p.department_id
  ORDER BY p.name ASC
`;

module.exports = camelKeys(selectPrograms);
