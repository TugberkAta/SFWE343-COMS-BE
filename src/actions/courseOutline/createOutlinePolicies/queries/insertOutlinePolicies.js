const { submitQuery } = require("~root/lib/database");

const insertOutlinePolicies = ({ policyOrder, title, bodyText }) => submitQuery`
  INSERT INTO outline_policies (
    policy_order,
    title,
    body_text
  ) VALUES (
    ${policyOrder},
    ${title},
    ${bodyText}
  )
`;

module.exports = insertOutlinePolicies;
