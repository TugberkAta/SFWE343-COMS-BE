const { submitQuery } = require("~root/lib/database");

const postEmailAuth = ({ email, shortcode }) => submitQuery`
  INSERT INTO user_email_shortcodes
    (email, shortcode)
  VALUES
    (${email}, ${shortcode});
`;

module.exports = postEmailAuth;
