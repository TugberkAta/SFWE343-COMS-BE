const { submitQuery, getInsertId } = require("~root/lib/database");

const insertOutlineWeeklyTopics = ({
  outlineId,
  weekNo,
  subjectTitle,
  detailsText,
  tasksPrivateStudyText
}) => submitQuery`
  INSERT INTO outline_weekly_topics (
    outline_id,
    week_no,
    subject_title,
    details_text,
    tasks_private_study_text
  ) VALUES (
    ${outlineId},
    ${weekNo},
    ${subjectTitle},
    ${detailsText},
    ${tasksPrivateStudyText}
  )
`;

module.exports = getInsertId(insertOutlineWeeklyTopics);
