const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectOutlineById = getFirst(
  camelKeys(
    outlineId => submitQuery`
    SELECT
      co.outline_id,
      co.course_id,
      co.term_id,
      co.version_no,
      co.status,
      co.lecturer_user_id,
      co.textbooks_text,
      co.additional_reading_text,
      co.created_by_user_id,
      co.created_at,
      co.updated_at,
      c.code AS course_code,
      c.name AS course_name,
      c.language AS course_language,
      c.category AS course_category,
      c.course_level_text,
      c.theory_hours,
      c.tutorial_hours,
      c.lab_hours,
      c.local_credits,
      c.ects_credits,
      t.academic_year,
      t.semester
    FROM course_outlines co
    JOIN courses c ON c.course_id = co.course_id
    JOIN terms t ON t.term_id = co.term_id
    WHERE co.outline_id = ${outlineId}
  `
  )
);

const selectOutlineObjectives = camelKeys(
  outlineId => submitQuery`
  SELECT objective_id, objective_order, objective_text
  FROM outline_objectives
  WHERE outline_id = ${outlineId}
  ORDER BY objective_order ASC
`
);

const selectOutlineAssistants = camelKeys(
  outlineId => submitQuery`
  SELECT assistant_user_id
  FROM outline_assistants
  WHERE outline_id = ${outlineId}
  ORDER BY assistant_user_id ASC
`
);

const selectOutlineContentItems = camelKeys(
  outlineId => submitQuery`
  SELECT content_item_id, content_order, content_text
  FROM outline_content_items
  WHERE outline_id = ${outlineId}
  ORDER BY content_order ASC
`
);

const selectOutlineLearningOutcomes = camelKeys(
  outlineId => submitQuery`
  SELECT clo_id, clo_number, statement
  FROM outline_learning_outcomes
  WHERE outline_id = ${outlineId}
  ORDER BY clo_number ASC
`
);

const selectOutlineWeeklyTopics = camelKeys(
  outlineId => submitQuery`
  SELECT weekly_topic_id, week_no, week_date, subject_title, details_text, tasks_private_study_text
  FROM outline_weekly_topics
  WHERE outline_id = ${outlineId}
  ORDER BY week_no ASC
`
);

const selectOutlineWeeklyTopicClos = camelKeys(
  outlineId => submitQuery`
  SELECT
    owc.weekly_topic_id,
    clo.clo_id,
    clo.clo_number
  FROM outline_weekly_topic_clos owc
  JOIN outline_weekly_topics owt ON owt.weekly_topic_id = owc.weekly_topic_id
  JOIN outline_learning_outcomes clo ON clo.clo_id = owc.clo_id
  WHERE owt.outline_id = ${outlineId}
  ORDER BY owt.week_no ASC, clo.clo_number ASC
`
);

const selectOutlinePolicies = camelKeys(
  outlineId => submitQuery`
  SELECT policy_id, policy_order, title, body_text
  FROM outline_policies
  WHERE outline_id = ${outlineId}
  ORDER BY policy_order ASC
`
);

const selectOutlineReferenceLinks = camelKeys(
  outlineId => submitQuery`
  SELECT reference_link_id, link_order, label, url
  FROM outline_reference_links
  WHERE outline_id = ${outlineId}
  ORDER BY link_order ASC
`
);

const selectOutlineWorkloadItems = camelKeys(
  outlineId => submitQuery`
  SELECT
    workload_item_id,
    item_order,
    activity_type,
    learning_activities_weeks,
    duration_hours
  FROM outline_workload_items
  WHERE outline_id = ${outlineId}
  ORDER BY item_order ASC
`
);

const selectOutlineEvaluationItems = camelKeys(
  outlineId => submitQuery`
  SELECT
    evaluation_item_id,
    item_order,
    name,
    category,
    weight_percent,
    notes
  FROM outline_evaluation_items
  WHERE outline_id = ${outlineId}
  ORDER BY item_order ASC
`
);

const selectOutlineEvaluationItemClos = camelKeys(
  outlineId => submitQuery`
  SELECT
    oeic.evaluation_item_id,
    clo.clo_id,
    clo.clo_number
  FROM outline_evaluation_item_clos oeic
  JOIN outline_evaluation_items oei ON oei.evaluation_item_id = oeic.evaluation_item_id
  JOIN outline_learning_outcomes clo ON clo.clo_id = oeic.clo_id
  WHERE oei.outline_id = ${outlineId}
  ORDER BY oei.item_order ASC, clo.clo_number ASC
`
);

const selectOutlinePrerequisiteCourseCodes = camelKeys(
  outlineId => submitQuery`
  SELECT pc.code
  FROM course_outlines co
  JOIN course_prerequisites cp ON cp.course_id = co.course_id
  JOIN courses pc ON pc.course_id = cp.prerequisite_course_id
  WHERE co.outline_id = ${outlineId}
  ORDER BY pc.code ASC
`
);

const fetchOutlineById = async ({ outlineId }) => {
  const outline = await selectOutlineById(outlineId);
  if (!outline) return null;

  const [
    objectives,
    assistants,
    contentItems,
    learningOutcomes,
    weeklyTopics,
    weeklyTopicClos,
    policies,
    referenceLinks,
    workloadItems,
    evaluationItems,
    evaluationItemClos,
    prerequisiteCourseCodes
  ] = await Promise.all([
    selectOutlineObjectives(outlineId),
    selectOutlineAssistants(outlineId),
    selectOutlineContentItems(outlineId),
    selectOutlineLearningOutcomes(outlineId),
    selectOutlineWeeklyTopics(outlineId),
    selectOutlineWeeklyTopicClos(outlineId),
    selectOutlinePolicies(outlineId),
    selectOutlineReferenceLinks(outlineId),
    selectOutlineWorkloadItems(outlineId),
    selectOutlineEvaluationItems(outlineId),
    selectOutlineEvaluationItemClos(outlineId),
    selectOutlinePrerequisiteCourseCodes(outlineId)
  ]);

  const cloMapByTopicId = weeklyTopicClos.reduce((acc, item) => {
    if (!acc[item.weeklyTopicId]) acc[item.weeklyTopicId] = [];
    acc[item.weeklyTopicId].push({
      cloId: item.cloId,
      cloNumber: item.cloNumber
    });
    return acc;
  }, {});

  const cloMapByEvaluationItemId = evaluationItemClos.reduce((acc, item) => {
    if (!acc[item.evaluationItemId]) acc[item.evaluationItemId] = [];
    acc[item.evaluationItemId].push({
      cloId: item.cloId,
      cloNumber: item.cloNumber
    });
    return acc;
  }, {});

  return {
    ...outline,
    assistantUserIds: assistants.map(item => item.assistantUserId),
    objectives,
    contentItems,
    learningOutcomes,
    weeklyTopics: weeklyTopics.map(topic => ({
      ...topic,
      clos: cloMapByTopicId[topic.weeklyTopicId] || []
    })),
    policies,
    referenceLinks,
    workloadItems,
    prerequisiteCourseCodes: prerequisiteCourseCodes.map(item => item.code),
    evaluationItems: evaluationItems.map(item => ({
      ...item,
      clos: cloMapByEvaluationItemId[item.evaluationItemId] || []
    }))
  };
};

module.exports = fetchOutlineById;
