const { submitQuery } = require("~root/lib/database");

const deleteOutlineReferenceLinks = ({ outlineId }) => submitQuery`
  DELETE FROM outline_reference_links WHERE outline_id = ${outlineId}
`;

module.exports = deleteOutlineReferenceLinks;
