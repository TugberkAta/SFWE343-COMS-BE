const insertOutlinePolicies = require("./queries/insertOutlinePolicies");

const createOutlinePolicies = async ({ outlineId, policies }) => {
  for (const policy of policies) {
    await insertOutlinePolicies({
      outlineId,
      policyOrder: policy.policyOrder,
      title: policy.title,
      bodyText: policy.bodyText
    });
  }
};

module.exports = createOutlinePolicies;
