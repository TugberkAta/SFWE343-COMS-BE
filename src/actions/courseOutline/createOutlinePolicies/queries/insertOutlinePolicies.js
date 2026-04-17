const { submitQuery } = require("~root/lib/database");

const insertOutlinePolicies = ({
  outlineId,
  policyOrder,
  title,
  bodyText
}) => submitQuery`
  INSERT INTO outline_policies (
    outline_id,
    policy_order,
    title,
    body_text
  ) VALUES (
    ${outlineId},
    ${policyOrder},
    ${title},
    ${bodyText}
  )
`;

module.exports = insertOutlinePolicies;
