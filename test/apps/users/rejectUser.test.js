const { expect } = require("chai");
const request = require("supertest");
const getJWTToken = require("~test/utils/getJWTToken");
const safeDescribe = require("~test/utils/safeDescribe");
const app = require("../../../src/app");

safeDescribe("#POST /reject-user", () => {
  let adminToken;

  before(async () => {
    adminToken = await getJWTToken(1);
  });

  it("should reject a user sign-in request", async () => {
    // Get a user with no role
    const usersRes = await request(app)
      .get("/users/no-role")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(usersRes.statusCode).to.equal(200);
    expect(usersRes.body).to.have.property("users");
    expect(usersRes.body.users.length).to.be.greaterThan(0);

    const userWithNoRole = usersRes.body.users[0];
    const { userId } = userWithNoRole;

    // Reject the sign-in request
    const res = await request(app)
      .post("/reject-user")
      .send({ userId })
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("message");
  });
});
