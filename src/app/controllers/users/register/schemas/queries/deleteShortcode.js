const { submitQuery } = require("~root/lib/database");

const deleteShortcode = ({ email, shortcode }) => submitQuery`
  DELETE FROM user_email_shortcodes
  WHERE email = ${email} AND shortcode = ${shortcode};
`;

module.exports = deleteShortcode;
