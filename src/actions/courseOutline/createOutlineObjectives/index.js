const insertOutlineObjectives = require("./queries/insertOutlineObjectives");

const createOutlineObjectives = async ({ outlineId, objectives }) => {
  for (const obj of objectives) {
    await insertOutlineObjectives({
      outlineId,
      objectiveOrder: obj.objectiveOrder,
      objectiveText: obj.objectiveText
    });
  }
};

module.exports = createOutlineObjectives;
