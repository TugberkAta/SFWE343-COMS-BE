const yup = require("yup");

const postEmailAuth = yup.object().shape({
  email: yup
    .string()
    .email()
    .required()
    .label("Email")
    .typeError("Email is invalid.")
});

module.exports = postEmailAuth;
