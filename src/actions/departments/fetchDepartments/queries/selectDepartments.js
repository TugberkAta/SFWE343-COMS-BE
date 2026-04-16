const { submitQuery, camelKeys } = require("~root/lib/database");

const selectDepartments = () => submitQuery`
  SELECT
    department_id,
    type,
    name
  FROM departments
  ORDER BY name ASC
`;

module.exports = camelKeys(selectDepartments);
