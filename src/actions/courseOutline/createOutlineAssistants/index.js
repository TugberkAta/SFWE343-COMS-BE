const insertOutlineAssistant = require("./queries/insertOutlineAssistant");

const createOutlineAssistants = async ({ outlineId, assistantUserIds }) => {
  if (!Array.isArray(assistantUserIds) || assistantUserIds.length === 0) {
    return;
  }

  const uniqueAssistantUserIds = [...new Set(assistantUserIds)];

  for (const assistantUserId of uniqueAssistantUserIds) {
    await insertOutlineAssistant({ outlineId, assistantUserId });
  }
};

module.exports = createOutlineAssistants;
