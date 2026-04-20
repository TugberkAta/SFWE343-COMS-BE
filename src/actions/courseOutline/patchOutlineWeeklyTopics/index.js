const insertOutlineWeeklyTopics = require("~root/actions/courseOutline/createOutlineWeeklyTopics/queries/insertOutlineWeeklyTopics");
const deleteOutlineWeeklyTopics = require("./queries/deleteOutlineWeeklyTopics");

const patchOutlineWeeklyTopics = async ({ outlineId, weeklyTopics }) => {
  if (weeklyTopics === undefined) {
    return {};
  }

  await deleteOutlineWeeklyTopics({ outlineId });
  const topicMap = {};
  for (const topic of weeklyTopics) {
    const weeklyTopicId = await insertOutlineWeeklyTopics({
      outlineId,
      weekNo: topic.weekNo,
      weekDate: topic.weekDate,
      subjectTitle: topic.subjectTitle,
      detailsText: topic.detailsText,
      tasksPrivateStudyText: topic.tasksPrivateStudyText
    });
    topicMap[topic.weekNo] = { weeklyTopicId, clos: topic.clos };
  }
  return topicMap;
};

module.exports = patchOutlineWeeklyTopics;
