const { expect } = require("chai");
const request = require("supertest");
const app = require("~root/app");
const getJWTToken = require("~test/utils/getJWTToken");
const safeDescribe = require("~test/utils/safeDescribe");

safeDescribe("#GET /outlines", () => {
  let adminToken;

  before(async () => {
    adminToken = await getJWTToken(1);
  });

  it("should retrieve outlines successfully", async () => {
    const res = await request(app)
      .get("/outlines")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("outlines");
    expect(res.body.outlines).to.be.an("array");
  });

  it("should reject request without authentication", async () => {
    const res = await request(app)
      .get("/outlines")
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(401);
  });
});
