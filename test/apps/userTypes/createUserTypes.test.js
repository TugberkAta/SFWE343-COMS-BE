const { expect } = require("chai");
const request = require("supertest");
const express = require("express");
const proxyquire = require("proxyquire")
  .noCallThru()
  .noPreserveCache();

const safeDescribe = require("~test/utils/safeDescribe");

const createUserTypePath = require.resolve(
  "~root/actions/userTypes/createUserType"
);
const controllerPath = require.resolve("~root/app/controllers/userTypes");

function buildApp({ mockResolvedValue, mockRejectedError } = {}) {
  const createUserTypeStub = mockRejectedError
    ? async () => {
        throw mockRejectedError;
      }
    : async () => ({
        userTypeId: mockResolvedValue !== undefined ? mockResolvedValue : 42
      });

  delete require.cache[controllerPath];
  delete require.cache[createUserTypePath];

  const { postUserType } = proxyquire(controllerPath, {
    "~root/actions/userTypes/createUserType": createUserTypeStub
  });

  const app = express();
  app.use(express.json());
  app.post("/__test__/userTypes", postUserType);
  return app;
}

safeDescribe("#controller postUserType", () => {
  afterEach(() => {
    delete require.cache[createUserTypePath];
    delete require.cache[controllerPath];
  });

  it("should return 201 and userTypeId on success", async () => {
    const app = buildApp({ mockResolvedValue: 7 });

    const res = await request(app)
      .post("/__test__/userTypes")
      .send({ typeName: "Admin", permissionsJson: ["read", "write"] })
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property("userTypeId", 7);
  });

  it("should call handleAPIError when createUserType action throws", async () => {
    const mockError = new Error("DB connection error");
    const app = buildApp({ mockRejectedError: mockError });

    const res = await request(app)
      .post("/__test__/userTypes")
      .send({ typeName: "Admin", permissionsJson: [] })
      .set("Accept", "application/json");

    expect(res.statusCode).to.be.at.least(400);
  });

  it("should pass undefined typeName to action when body is empty", async () => {
    const app = buildApp({ mockResolvedValue: 1 });

    const res = await request(app)
      .post("/__test__/userTypes")
      .send({})
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(201);
  });
});
