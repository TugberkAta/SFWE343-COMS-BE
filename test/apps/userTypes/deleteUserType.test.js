const { expect } = require("chai");
const request = require("supertest");
const express = require("express");
const proxyquire = require("proxyquire")
  .noCallThru()
  .noPreserveCache();

const safeDescribe = require("~test/utils/safeDescribe");

const deleteUserTypePath = require.resolve(
  "~root/actions/userTypes/deleteUserType"
);
const controllerPath = require.resolve("~root/app/controllers/userTypes");

function buildApp({ mockRejectedError } = {}) {
  const deleteUserTypeStub = mockRejectedError
    ? async () => {
        throw mockRejectedError;
      }
    : async () => {};

  delete require.cache[controllerPath];
  delete require.cache[deleteUserTypePath];

  const { removeUserType } = proxyquire(controllerPath, {
    "~root/actions/userTypes/deleteUserType": deleteUserTypeStub
  });

  const app = express();
  app.use(express.json());
  app.delete("/__test__/userTypes/:userTypeId", removeUserType);
  return app;
}

safeDescribe("#controller removeUserType", () => {
  afterEach(() => {
    delete require.cache[deleteUserTypePath];
    delete require.cache[controllerPath];
  });

  it("should return 200 and success message on successful deletion", async () => {
    const app = buildApp();

    const res = await request(app)
      .delete("/__test__/userTypes/5")
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property(
      "message",
      "User type deleted successfully."
    );
  });

  it("should call handleAPIError when deleteUserType action throws", async () => {
    const mockError = new Error("Record not found");
    const app = buildApp({ mockRejectedError: mockError });

    const res = await request(app)
      .delete("/__test__/userTypes/999")
      .set("Accept", "application/json");

    expect(res.statusCode).to.be.at.least(400);
  });

  it("should pass userTypeId route param to the action", async () => {
    let capturedId;

    delete require.cache[controllerPath];
    delete require.cache[deleteUserTypePath];

    const { removeUserType } = proxyquire(controllerPath, {
      "~root/actions/userTypes/deleteUserType": async ({ userTypeId }) => {
        capturedId = userTypeId;
      }
    });

    const app = express();
    app.use(express.json());
    app.delete("/__test__/userTypes/:userTypeId", removeUserType);

    await request(app).delete("/__test__/userTypes/12");

    expect(capturedId).to.equal("12");
  });
});
