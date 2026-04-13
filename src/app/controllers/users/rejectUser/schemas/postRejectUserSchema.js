const yup = require("yup");

const postRejectUserSchema = yup.object().shape({
  userId: yup
    .number()
    .integer()
    .positive()
    .required("User id is required.")
});

module.exports = postRejectUserSchema;
