const yup = require("yup");

const outlineApprovalActionSchema = yup.object().shape({
  action: yup
    .string()
    .oneOf(["approve", "reject"], "Action must be approve or reject.")
    .required("Action is required."),
  commentText: yup.string().when("action", {
    is: "reject",
    then: schema =>
      schema.trim().required("Comment is required when rejecting an outline."),
    otherwise: schema => schema.default("")
  })
});

module.exports = outlineApprovalActionSchema;
