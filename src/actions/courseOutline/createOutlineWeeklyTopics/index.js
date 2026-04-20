const insertOutlineWeeklyTopics = require("./queries/insertOutlineWeeklyTopics");

const createOutlineWeeklyTopics = async ({ outlineId, weeklyTopics }) => {
  const topicMap = {};
  for (const topic of weeklyTopics || []) {
    const weeklyTopicId = await insertOutlineWeeklyTopics({
      outlineId,
      weekNo: topic.weekNo,
      weekDate: topic.weekDate,
      subjectTitle: topic.subjectTitle || topic.topic || "",
      detailsText: topic.detailsText || topic.description,
      tasksPrivateStudyText: topic.tasksPrivateStudyText
    });
    topicMap[topic.weekNo] = { weeklyTopicId, clos: topic.clos || [] };
  }
  return topicMap;
};

module.exports = createOutlineWeeklyTopics;
