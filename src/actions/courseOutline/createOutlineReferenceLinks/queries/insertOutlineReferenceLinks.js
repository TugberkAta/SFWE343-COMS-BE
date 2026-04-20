const { submitQuery } = require("~root/lib/database");

const insertOutlineReferenceLinks = ({
  outlineId,
  linkOrder,
  label,
  url
}) => submitQuery`
  INSERT INTO outline_reference_links (
    outline_id,
    link_order,
    label,
    url
  ) VALUES (
    ${outlineId},
    ${linkOrder},
    ${label},
    ${url}
  )
`;

module.exports = insertOutlineReferenceLinks;
