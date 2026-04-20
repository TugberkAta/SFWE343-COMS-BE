/* eslint-env mocha */
const { expect } = require("chai");
const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());

app.post("/reject-user", (req, res) => {
  if (!req.headers.authorization)
    return res.status(401).json({ error: "No token" });
  if (!req.body.userId)
    return res.status(400).json({ error: "userId required" });
  return res.json({ success: true });
});

app.get("/users/with-role", (req, res) => {
  if (!req.headers.authorization)
    return res.status(401).json({ error: "No token" });
  return res.json({ users: [] });
});

describe("Reject User & Role Tests", () => {
  it("POST /reject-user requires auth", async () => {
    const res = await request(app)
      .post("/reject-user")
      .send({ userId: 1 });
    expect(res.statusCode).to.equal(401);
  });

  it("POST /reject-user requires userId", async () => {
    const res = await request(app)
      .post("/reject-user")
      .set("Authorization", "Bearer x")
      .send({});
    expect(res.statusCode).to.equal(400);
  });

  it("GET /users/with-role requires auth", async () => {
    const res = await request(app).get("/users/with-role?role=Admin");
    expect(res.statusCode).to.equal(401);
  });
});
