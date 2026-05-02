const { submitQuery } = require("~root/lib/database");

const insertOutlineAssistant = ({ outlineId, assistantUserId }) => submitQuery`
  INSERT INTO outline_assistants (
    outline_id,
    assistant_user_id
  ) VALUES (
    ${outlineId},
    ${assistantUserId}
  )
`;

module.exports = insertOutlineAssistant;
