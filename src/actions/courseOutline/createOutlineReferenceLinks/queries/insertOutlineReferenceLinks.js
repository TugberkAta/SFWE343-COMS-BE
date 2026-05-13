const { submitQuery } = require("~root/lib/database");

const insertOutlineReferenceLinks = ({ linkOrder, label, url }) => submitQuery`
  INSERT INTO outline_reference_links (
    link_order,
    label,
    url
  ) VALUES (
    ${linkOrder},
    ${label},
    ${url}
  )
`;

module.exports = insertOutlineReferenceLinks;
