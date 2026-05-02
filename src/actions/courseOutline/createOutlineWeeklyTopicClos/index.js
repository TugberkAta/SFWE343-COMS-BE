const insertOutlineWeeklyTopicClos = require("./queries/insertOutlineWeeklyTopicClos");

const createOutlineWeeklyTopicClos = async ({ topicMap, cloMap }) => {
  for (const weekNo of Object.keys(topicMap)) {
    const { weeklyTopicId, clos } = topicMap[weekNo];
    const insertedCloIds = new Set();

    for (const clo of clos || []) {
      const cloKey =
        clo.cloNumber || clo.cloCode || (typeof clo === "string" ? clo : null);
      const cloId = cloMap[cloKey];

      if (cloId && !insertedCloIds.has(cloId)) {
        await insertOutlineWeeklyTopicClos({ weeklyTopicId, cloId });
        insertedCloIds.add(cloId);
      }
    }
  }
};

module.exports = createOutlineWeeklyTopicClos;
