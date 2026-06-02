const yup = require("yup");

const learningOutcomeSchema = yup.object().shape({
  cloNumber: yup
    .number()
    .integer()
    .positive(),
  statement: yup.string()
});

const postCourseOutlineSchema = yup.object().shape({
  learningOutcomes: yup
    .array()
    .of(learningOutcomeSchema)
    .min(5, "At least 5 CLOs are required.")
    .required("Learning outcomes are required.")
});

module.exports = postCourseOutlineSchema;
