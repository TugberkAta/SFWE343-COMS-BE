const yup = require("yup");

const getOutlineByIdSchema = yup.object().shape({
  outlineId: yup
    .number()
    .integer()
    .positive()
    .required("Outline id is required.")
});

module.exports = getOutlineByIdSchema;
