const insertOutlineWeeklyTopicClos = require("./queries/insertOutlineWeeklyTopicClos");

const createOutlineWeeklyTopicClos = async ({ topicMap, cloMap }) => {
  for (const weekNo of Object.keys(topicMap)) {
    const { weeklyTopicId, clos } = topicMap[weekNo];
    for (const clo of clos) {
      const cloId = cloMap[clo.cloNumber];
      if (cloId) {
        await insertOutlineWeeklyTopicClos({ weeklyTopicId, cloId });
      }
    }
  }
};

module.exports = createOutlineWeeklyTopicClos;
