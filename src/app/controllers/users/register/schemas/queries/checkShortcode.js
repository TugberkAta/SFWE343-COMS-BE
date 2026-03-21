const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const checkShortcode = ({ email, shortcode }) => submitQuery`
  SELECT
    email,
    shortcode
  FROM user_email_shortcodes
  WHERE email = ${email} AND shortcode = ${shortcode};
`;

module.exports = getFirst(camelKeys(checkShortcode));
