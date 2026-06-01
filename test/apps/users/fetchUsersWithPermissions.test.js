const { expect } = require("chai");
const request = require("supertest");
const getJWTToken = require("~test/utils/getJWTToken");
const safeDescribe = require("~test/utils/safeDescribe");
const app = require("../../../src/app");

safeDescribe("#GET /users/with-role permissions", () => {
  let adminToken;

  before(async () => {
    adminToken = await getJWTToken(1);
  });

  it("should fetch approved users and include permissionsJson", async () => {
    const res = await request(app)
      .get("/users/with-role")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("users");
    expect(res.body.users).to.be.an("array");
    expect(res.body.users.length).to.be.greaterThan(0);

    const userWithPermissions = res.body.users.find(
      user =>
        Array.isArray(user.permissionsJson) && user.permissionsJson.length > 0
    );

    expect(userWithPermissions).to.not.equal(undefined);
    expect(userWithPermissions).to.include.keys(
      "userId",
      "userTypeId",
      "typeName",
      "permissionsJson"
    );
    expect(userWithPermissions.permissionsJson).to.be.an("array");
  });
});
