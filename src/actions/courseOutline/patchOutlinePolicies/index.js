const insertOutlinePolicies = require("~root/actions/courseOutline/createOutlinePolicies/queries/insertOutlinePolicies");
const deleteOutlinePolicies = require("./queries/deleteOutlinePolicies");

const patchOutlinePolicies = async ({ policies }) => {
  if (policies === undefined) {
    return;
  }

  await deleteOutlinePolicies();
  for (const [index, policy] of policies.entries()) {
    await insertOutlinePolicies({
      policyOrder:
        policy.policyOrder === undefined ? index + 1 : policy.policyOrder,
      title: policy.title || policy.policyType || "",
      bodyText: policy.bodyText || policy.description || ""
    });
  }
};

module.exports = patchOutlinePolicies;
