const yup = require("yup");

const deleteOutlineByIdSchema = yup.object().shape({
  outlineId: yup
    .number()
    .integer()
    .positive()
    .required("Outline id is required.")
});

module.exports = deleteOutlineByIdSchema;
