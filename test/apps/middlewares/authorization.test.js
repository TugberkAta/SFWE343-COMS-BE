const { expect } = require("chai");
const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

const authentication = require("~root/app/middlewares/authentication");
const { ENDPOINT_PERMISSIONS } = require("~root/constants/endpointPermissions");
const safeDescribe = require("~test/utils/safeDescribe");

function buildAppWithStubbedPermissions(permissionsArray) {
  const getUserRolePath = require.resolve(
    "~root/app/middlewares/authorisation/queries/getUserRole"
  );

  require.cache[getUserRolePath] = {
    id: getUserRolePath,
    filename: getUserRolePath,
    loaded: true,
    exports: async () => ({ permissionsJson: permissionsArray })
  };

  const authorisePath = require.resolve(
    "~root/app/middlewares/authorisation/index.js"
  );
  delete require.cache[authorisePath];

  // eslint-disable-next-line global-require
  const authorise = require("~root/app/middlewares/authorisation");

  const app = express();
  app.use(express.json());

  app.post(
    "/__test__/approve",
    authentication,
    authorise({ permissions: [ENDPOINT_PERMISSIONS.users.APPROVE] }),
    (req, res) => res.status(200).send({ ok: true })
  );

  return app;
}

safeDescribe("#middleware authorisation", () => {
  it("allows request when user has required permission", async () => {
    const app = buildAppWithStubbedPermissions([
      ENDPOINT_PERMISSIONS.users.APPROVE
    ]);
    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);

    const res = await request(app)
      .post("/__test__/approve")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({ ok: true });
  });

  it("denies request when user lacks required permission", async () => {
    const app = buildAppWithStubbedPermissions([]);
    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);

    const res = await request(app)
      .post("/__test__/approve")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(403);
  });
});
