const yup = require("yup");

const patchUserWithRoleSchema = yup
  .object()
  .shape({
    userTypeId: yup
      .number()
      .integer()
      .positive(),
    approved: yup.boolean()
  })
  .test(
    "at-least-one-field",
    "Provide userTypeId and/or approved.",
    value =>
      value !== undefined &&
      (value.userTypeId !== undefined || value.approved !== undefined)
  );

module.exports = patchUserWithRoleSchema;
