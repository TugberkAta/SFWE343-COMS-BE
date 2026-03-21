const yup = require("yup");

const postUserSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("First name is required."),
  lastName: yup
    .string()
    .trim()
    .required("Last name is required."),
  email: yup
    .string()
    .trim()
    .email("Email is invalid.")
    .required("Email is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters."),
  shortcode: yup
    .string()
    .trim()
    .required("Shortcode is required.")
});

module.exports = postUserSchema;
