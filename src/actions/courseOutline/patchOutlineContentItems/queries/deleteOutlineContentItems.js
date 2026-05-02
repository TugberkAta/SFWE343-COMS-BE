const { submitQuery } = require("~root/lib/database");

const deleteOutlineContentItems = ({ outlineId }) => submitQuery`
  DELETE FROM outline_content_items WHERE outline_id = ${outlineId}
`;

module.exports = deleteOutlineContentItems;
