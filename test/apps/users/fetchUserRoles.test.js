const { expect } = require("chai");
const request = require("supertest");
const getJWTToken = require("~test/utils/getJWTToken");
const safeDescribe = require("~test/utils/safeDescribe");
const app = require("../../../src/app");

safeDescribe("#GET /user-roles", () => {
  let adminToken;

  before(async () => {
    adminToken = await getJWTToken(1);
  });

  it("should fetch all user roles", async () => {
    const res = await request(app)
      .get("/user-roles")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property("userRoles");
    expect(res.body.userRoles).to.be.an("array");
    expect(res.body.userRoles.length).to.be.greaterThan(0);
  });
});
