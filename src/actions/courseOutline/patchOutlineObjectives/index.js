const deleteOutlineObjectives = require("./queries/deleteOutlineObjectives");
const insertOutlineObjectives = require("~root/actions/courseOutline/createOutlineObjectives/queries/insertOutlineObjectives");

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
