const yup = require("yup");

const postUserSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required.")
    .max(50, "First name must be at most 50 characters."),
  lastName: yup
    .string()
    .required("Last name is required.")
    .max(50, "Last name must be at most 50 characters."),
  email: yup
    .string()
    .email("Email must be valid.")
    .required("Email is required."),
  password: yup.string().required("Password is required."),
  shortcode: yup.string().required("Shortcode is required.")
});

module.exports = postUserSchema;
