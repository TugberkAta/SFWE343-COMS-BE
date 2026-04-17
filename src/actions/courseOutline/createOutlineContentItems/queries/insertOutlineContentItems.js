const { submitQuery } = require("~root/lib/database");

const insertOutlineContentItems = ({
  outlineId,
  contentOrder,
  contentText
}) => submitQuery`
  INSERT INTO outline_content_items (
    outline_id,
    content_order,
    content_text
  ) VALUES (
    ${outlineId},
    ${contentOrder},
    ${contentText}
  )
`;

module.exports = insertOutlineContentItems;
