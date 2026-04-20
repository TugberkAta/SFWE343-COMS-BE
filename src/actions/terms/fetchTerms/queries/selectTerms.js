const { submitQuery, camelKeys } = require("~root/lib/database");

const selectTerms = () => submitQuery`
  SELECT
    term_id,
    academic_year,
    semester,
    start_date,
    end_date
  FROM terms
  ORDER BY academic_year DESC, FIELD(semester, "fall", "spring", "summer") ASC
`;

module.exports = camelKeys(selectTerms);
