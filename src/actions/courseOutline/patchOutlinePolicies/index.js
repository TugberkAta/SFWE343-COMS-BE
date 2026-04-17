const deleteOutlinePolicies = require("./queries/deleteOutlinePolicies");
const insertOutlinePolicies = require("~root/actions/courseOutline/createOutlinePolicies/queries/insertOutlinePolicies");

const patchOutlinePolicies = async ({ outlineId, policies }) => {
  await deleteOutlinePolicies({ outlineId });
  for (const policy of policies) {
    await insertOutlinePolicies({
      outlineId,
      policyOrder: policy.policyOrder,
      title: policy.title,
      bodyText: policy.bodyText
    });
  }
};

module.exports = patchOutlinePolicies;
