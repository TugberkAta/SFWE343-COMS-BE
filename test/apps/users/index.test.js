const { expect } = require("chai");
const request = require("supertest");
const app = require("~root/app");
const getJWTToken = require("~test/utils/getJWTToken");
const safeDescribe = require("~test/utils/safeDescribe");

safeDescribe("#POST sign-in-approval", () => {
  let adminToken;

  before(async () => {
    adminToken = await getJWTToken(1);
  });

  it("should reject sign-in request for user with no role", async () => {
    const usersRes = await request(app)
      .get("/users/no-role")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(usersRes.statusCode).to.equal(200);
    expect(usersRes.body).to.have.property("users");
    expect(usersRes.body.users.length).to.be.greaterThan(0);

    const userWithNoRole = usersRes.body.users[0];
    const { userId } = userWithNoRole;

    const res = await request(app)
      .post("/reject-user")
      .send({
        userId
      })
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("message");
  });

  it("should approve user with no role and assign a user type", async () => {
    const usersRes = await request(app)
      .get("/users/no-role")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(usersRes.statusCode).to.equal(200);
    expect(usersRes.body).to.have.property("users");
    expect(usersRes.body.users.length).to.be.greaterThan(0);

    const userWithNoRole = usersRes.body.users[0];
    const { userId } = userWithNoRole;

    const res = await request(app)
      .post("/approve-user")
      .send({
        userId,
        userTypeId: 4,
        approvedStatus: true
      })
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("message");
  });

  it("should approve user that is already approved", async () => {
    const usersRes = await request(app)
      .get("/users/with-role")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(usersRes.statusCode).to.equal(200);
    expect(usersRes.body).to.have.property("users");
    expect(usersRes.body.users.length).to.be.greaterThan(0);

    const userWithRole = usersRes.body.users.find(u => u.userId !== 1);
    expect(userWithRole).to.not.equal(undefined);

    const { userId } = userWithRole;

    const res = await request(app)
      .post("/approve-user")
      .send({
        userId,
        userTypeId: 2,
        approvedStatus: true
      })
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("message");
  });
});
