const insertOutlineObjectives = require("./queries/insertOutlineObjectives");

const createOutlineObjectives = async ({ outlineId, objectives }) => {
  for (const [index, obj] of (objectives || []).entries()) {
    await insertOutlineObjectives({
      outlineId,
      objectiveOrder:
        obj.objectiveOrder === undefined ? index + 1 : obj.objectiveOrder,
      objectiveText: obj.objectiveText || obj.description || ""
    });
  }
};

module.exports = createOutlineObjectives;
