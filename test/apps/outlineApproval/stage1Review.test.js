const { expect } = require("chai");
const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

const safeDescribe = require("~test/utils/safeDescribe");

function stubModule(modulePath, mockExport) {
  const resolved = require.resolve(modulePath);
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: mockExport
  };
}

function clearModule(modulePath) {
  const resolved = require.resolve(modulePath);
  delete require.cache[resolved];
}

function buildApp(handler) {
  const authentication = require("~root/app/middlewares/authentication");
  const app = express();
  app.use(express.json());
  app.post("/outlines/:outlineId/stage1-review", authentication, handler);
  return app;
}

function makeToken(userId = 1) {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
}

safeDescribe("#postStage1Review", () => {
  let app;

  beforeEach(() => {
    stubModule(
      "~root/actions/outlineApproval/submitOutline/queries/updateOutlineStatus",
      async () => {}
    );
    stubModule(
      "~root/actions/outlineApproval/stage1Review/queries/updateWorkflowStage1",
      async () => {}
    );
    stubModule(
      "~root/actions/outlineApproval/stage1Review/queries/insertApprovalComment",
      async () => {}
    );

    clearModule("~root/actions/outlineApproval/stage1Review");
    clearModule("~root/app/controllers/outlineApproval");

    const {
      postStage1Review
    } = require("~root/app/controllers/outlineApproval");
    app = buildApp(postStage1Review);
  });

  afterEach(() => {
    clearModule(
      "~root/actions/outlineApproval/submitOutline/queries/updateOutlineStatus"
    );
    clearModule(
      "~root/actions/outlineApproval/stage1Review/queries/updateWorkflowStage1"
    );
    clearModule(
      "~root/actions/outlineApproval/stage1Review/queries/insertApprovalComment"
    );
    clearModule("~root/actions/outlineApproval/stage1Review");
    clearModule("~root/app/controllers/outlineApproval");
  });

  it("returns 200 and approve message when action is approve", async () => {
    const res = await request(app)
      .post("/outlines/10/stage1-review")
      .set("Authorization", `Bearer ${makeToken(5)}`)
      .set("Accept", "application/json")
      .send({ action: "approve", commentText: "Looks good!" });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({ message: "Outline approved at stage 1." });
  });

  it("returns 200 and reject message when action is reject", async () => {
    const res = await request(app)
      .post("/outlines/10/stage1-review")
      .set("Authorization", `Bearer ${makeToken(5)}`)
      .set("Accept", "application/json")
      .send({ action: "reject", commentText: "Needs revision." });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({ message: "Outline rejected at stage 1." });
  });

  it("returns 401 when no auth token is provided", async () => {
    const res = await request(app)
      .post("/outlines/10/stage1-review")
      .set("Accept", "application/json")
      .send({ action: "approve", commentText: "Looks good!" });

    expect(res.statusCode).to.equal(401);
  });

  it("returns 500 when updateWorkflowStage1 throws an error", async () => {
    stubModule(
      "~root/actions/outlineApproval/stage1Review/queries/updateWorkflowStage1",
      async () => {
        throw new Error("DB error");
      }
    );
    clearModule("~root/actions/outlineApproval/stage1Review");
    clearModule("~root/app/controllers/outlineApproval");

    const {
      postStage1Review
    } = require("~root/app/controllers/outlineApproval");
    const errorApp = buildApp(postStage1Review);

    const res = await request(errorApp)
      .post("/outlines/10/stage1-review")
      .set("Authorization", `Bearer ${makeToken(5)}`)
      .set("Accept", "application/json")
      .send({ action: "approve", commentText: "ok" });

    expect(res.statusCode).to.equal(500);
  });
});
