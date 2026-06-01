const { expect } = require("chai");
const request = require("supertest");
const express = require("express");
const proxyquire = require("proxyquire")
  .noCallThru()
  .noPreserveCache();

const safeDescribe = require("~test/utils/safeDescribe");

const updateUserTypePath = require.resolve(
  "~root/actions/userTypes/updateUserType"
);
const controllerPath = require.resolve("~root/app/controllers/userTypes");

function buildApp({ mockRejectedError } = {}) {
  const updateUserTypeStub = mockRejectedError
    ? async () => {
        throw mockRejectedError;
      }
    : async () => {};

  delete require.cache[controllerPath];
  delete require.cache[updateUserTypePath];

  const { putUserType } = proxyquire(controllerPath, {
    "~root/actions/userTypes/updateUserType": updateUserTypeStub
  });

  const app = express();
  app.use(express.json());
  app.put("/__test__/userTypes/:userTypeId", putUserType);
  return app;
}

safeDescribe("#controller putUserType", () => {
  afterEach(() => {
    delete require.cache[updateUserTypePath];
    delete require.cache[controllerPath];
  });

  it("should return 200 and success message on successful update", async () => {
    const app = buildApp();

    const res = await request(app)
      .put("/__test__/userTypes/3")
      .send({ typeName: "Editor", permissionsJson: ["read"] })
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property(
      "message",
      "User type updated successfully."
    );
  });

  it("should call handleAPIError when updateUserType action throws", async () => {
    const mockError = new Error("Update failed");
    const app = buildApp({ mockRejectedError: mockError });

    const res = await request(app)
      .put("/__test__/userTypes/3")
      .send({ typeName: "Editor", permissionsJson: [] })
      .set("Accept", "application/json");

    expect(res.statusCode).to.be.at.least(400);
  });

  it("should correctly pass userTypeId, typeName and permissionsJson to the action", async () => {
    let captured;

    delete require.cache[controllerPath];
    delete require.cache[updateUserTypePath];

    const { putUserType } = proxyquire(controllerPath, {
      "~root/actions/userTypes/updateUserType": async args => {
        captured = args;
      }
    });

    const app = express();
    app.use(express.json());
    app.put("/__test__/userTypes/:userTypeId", putUserType);

    await request(app)
      .put("/__test__/userTypes/8")
      .send({ typeName: "Moderator", permissionsJson: ["read", "delete"] });

    expect(captured).to.deep.equal({
      userTypeId: "8",
      typeName: "Moderator",
      permissionsJson: ["read", "delete"]
    });
  });
});
