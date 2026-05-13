const createOutlineAssistants = require("~root/actions/courseOutline/createOutlineAssistants");
const deleteOutlineAssistants = require("./queries/deleteOutlineAssistants");

const NO_UPDATE = Symbol("NO_UPDATE");

const patchOutlineAssistants = async ({
  outlineId,
  assistantUserIds = NO_UPDATE
}) => {
  if (assistantUserIds === NO_UPDATE) {
    return;
  }

  await deleteOutlineAssistants({ outlineId });
  await createOutlineAssistants({ outlineId, assistantUserIds });
};

patchOutlineAssistants.NO_UPDATE = NO_UPDATE;

module.exports = patchOutlineAssistants;
