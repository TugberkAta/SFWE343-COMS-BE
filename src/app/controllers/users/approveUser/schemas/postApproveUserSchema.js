const yup = require("yup");

const postApproveUserSchema = yup.object().shape({
  userId: yup
    .number()
    .integer()
    .positive()
    .required("User id is required."),
  userRoleId: yup
    .number()
    .integer()
    .positive()
    .required("User role id is required."),
  userTypeId: yup
    .number()
    .integer()
    .positive()
    .required("User type id is required."),
  approvedStatus: yup.boolean().required("Approved status is required.")
});

module.exports = postApproveUserSchema;
