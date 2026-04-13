const { expect } = require("chai");
const request = require("supertest");
const app = require("~root/app");
const getJWTToken = require("~test/utils/getJWTToken");
const safeDescribe = require("~test/utils/safeDescribe");

safeDescribe("Admin User Endpoints", () => {
  let adminToken;
  let userToken;

  before(async () => {
    adminToken = await getJWTToken(1);
    userToken = await getJWTToken(2);
  });

  // POST /approve-user
  it("should reject approve-user for unauthenticated request", async () => {
    const res = await request(app)
      .post("/approve-user")
      .send()
      .set("Authorization", `Bearer NO-SUCH-TOKEN`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(403);
  });

  it("should reject approve-user for non-admin user", async () => {
    const res = await request(app)
      .post("/approve-user")
      .send()
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(403);
  });

  it("should approve user successfully as admin", async () => {
    const res = await request(app)
      .post("/approve-user")
      .send({ userId: 2, userRoleId: 1, approvedStatus: true })
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(200);
  });

  // GET /users/no-role
  it("should reject users/no-role for unauthenticated request", async () => {
    const res = await request(app)
      .get("/users/no-role")
      .set("Authorization", `Bearer NO-SUCH-TOKEN`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(403);
  });

  it("should reject users/no-role for non-admin user", async () => {
    const res = await request(app)
      .get("/users/no-role")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(403);
  });

  it("should get users with no role as admin", async () => {
    const res = await request(app)
      .get("/users/no-role")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(200);
    expect(res.body.users).to.be.an("array");
  });

  // GET /users/with-role
  it("should reject users/with-role for unauthenticated request", async () => {
    const res = await request(app)
      .get("/users/with-role")
      .set("Authorization", `Bearer NO-SUCH-TOKEN`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(403);
  });

  it("should reject users/with-role for non-admin user", async () => {
    const res = await request(app)
      .get("/users/with-role")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(403);
  });

  it("should get users with role as admin", async () => {
    const res = await request(app)
      .get("/users/with-role")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(200);
    expect(res.body.users).to.be.an("array");
  });
});
