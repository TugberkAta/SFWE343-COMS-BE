const { submitQuery } = require("~root/lib/database");

const deleteOutlineReferenceLinks = () => submitQuery`
  DELETE FROM outline_reference_links
`;

module.exports = deleteOutlineReferenceLinks;
