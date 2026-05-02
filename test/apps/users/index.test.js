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

  it("should approve user with no role and assign admin role", async () => {
    // First, get a user with no role
    const usersRes = await request(app)
      .get("/users/no-role")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(usersRes.statusCode).to.equal(200);
    expect(usersRes.body).to.have.property("users");
    expect(usersRes.body.users.length).to.be.greaterThan(0);

    const userWithNoRole = usersRes.body.users[0];
    const userId = userWithNoRole.userId;

    // Approve the user and assign admin role (roleId = 1)
    const res = await request(app)
      .post("/approve-user")
      .send({
        userId: userId,
        userRoleId: 1,
        approvedStatus: true
      })
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("message");
  });

  it("should approve user that already has a role", async () => {
    // Get users with roles
    const usersRes = await request(app)
      .get("/users/with-role")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(usersRes.statusCode).to.equal(200);
    expect(usersRes.body).to.have.property("users");
    expect(usersRes.body.users.length).to.be.greaterThan(0);

    // Find a user that is not the admin (userId = 1)
    const userWithRole = usersRes.body.users.find(u => u.userId !== 1);
    expect(userWithRole).to.not.be.undefined;

    const userId = userWithRole.userId;

    // Approve with a different role (e.g., roleId = 3)
    const res = await request(app)
      .post("/approve-user")
      .send({
        userId: userId,
        userRoleId: 3,
        approvedStatus: true
      })
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("message");
  });

  it("should reject sign-in request for user with no role", async () => {
    // Get a user with no role
    const usersRes = await request(app)
      .get("/users/no-role")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(usersRes.statusCode).to.equal(200);
    expect(usersRes.body).to.have.property("users");
    expect(usersRes.body.users.length).to.be.greaterThan(0);

    const userWithNoRole = usersRes.body.users[0];
    const userId = userWithNoRole.userId;

    // Reject the sign-in request using the reject-user endpoint
    const res = await request(app)
      .post("/reject-user")
      .send({
        userId: userId
      })
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("message");
  });
});
