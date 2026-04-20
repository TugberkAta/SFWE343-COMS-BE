const insertOutlineObjectives = require("~root/actions/courseOutline/createOutlineObjectives/queries/insertOutlineObjectives");
const deleteOutlineObjectives = require("./queries/deleteOutlineObjectives");

const patchOutlineObjectives = async ({ outlineId, objectives }) => {
  if (objectives === undefined) {
    return;
  }

  await deleteOutlineObjectives({ outlineId });
  for (const [index, obj] of objectives.entries()) {
    await insertOutlineObjectives({
      outlineId,
      objectiveOrder:
        obj.objectiveOrder === undefined ? index + 1 : obj.objectiveOrder,
      objectiveText: obj.objectiveText || obj.description || ""
    });
  }
};

module.exports = patchOutlineObjectives;
