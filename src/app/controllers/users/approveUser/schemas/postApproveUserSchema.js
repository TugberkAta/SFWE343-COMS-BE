const Joi = require("joi");

const postApproveUserSchema = Joi.object({
  userId: Joi.number()
    .integer()
    .positive()
    .required(),
  userRoleId: Joi.number()
    .integer()
    .positive()
    .required(),
  approvedStatus: Joi.boolean().required()
});

module.exports = postApproveUserSchema;
