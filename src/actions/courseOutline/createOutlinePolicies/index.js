const insertOutlinePolicies = require("./queries/insertOutlinePolicies");

const createOutlinePolicies = async ({ policies }) => {
  for (const [index, policy] of (policies || []).entries()) {
    await insertOutlinePolicies({
      policyOrder:
        policy.policyOrder === undefined ? index + 1 : policy.policyOrder,
      title: policy.title || policy.policyType || "",
      bodyText: policy.bodyText || policy.description || ""
    });
  }
};

module.exports = createOutlinePolicies;
