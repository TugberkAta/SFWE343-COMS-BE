const insertOutlineObjectives = require("~root/actions/courseOutline/createOutlineObjectives/queries/insertOutlineObjectives");
const deleteOutlineObjectives = require("./queries/deleteOutlineObjectives");

const patchOutlineObjectives = async ({ outlineId, objectives }) => {
  await deleteOutlineObjectives({ outlineId });
  for (const obj of objectives) {
    await insertOutlineObjectives({
      outlineId,
      objectiveOrder: obj.objectiveOrder,
      objectiveText: obj.objectiveText
    });
  }
};

module.exports = patchOutlineObjectives;
