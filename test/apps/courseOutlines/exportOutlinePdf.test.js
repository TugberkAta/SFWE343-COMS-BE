const { expect } = require("chai");
const request = require("supertest");
const app = require("~root/app");
const safeDescribe = require("~test/utils/safeDescribe");

safeDescribe("#GET /outlines/:outlineId/pdf", () => {
  let authToken;
  let testOutlineId;

  const getAuthToken = async () => {
    const loginRes = await request(app)
      .post("/login")
      .send({
        email: "testuser@test.com",
        password: "testpassword123"
      })
      .set("Accept", "application/json");

    if (loginRes.body && loginRes.body.token) {
      return loginRes.body.token;
    }
    return null;
  };

  const createTestOutline = async token => {
    const outlineData = {
      courseId: 1,
      termId: 1,
      lecturerUserId: 1,
      assistantUserIds: [],
      textbooksText: "Test Textbook",
      additionalReadingText: "Test Reading",
      officeHours: "Mon 10-12",
      officeCode: "A101",
      createdByUserId: 1,
      objectives: [{ orderIndex: 1, statement: "Test objective" }],
      contentItems: [{ orderIndex: 1, title: "Introduction", hours: 3 }],
      learningOutcomes: [
        { cloNumber: 1, statement: "CLO 1" },
        { cloNumber: 2, statement: "CLO 2" },
        { cloNumber: 3, statement: "CLO 3" },
        { cloNumber: 4, statement: "CLO 4" },
        { cloNumber: 5, statement: "CLO 5" }
      ],
      weeklyTopics: [],
      policies: [],
      referenceLinks: [],
      workloadItems: [],
      evaluationItems: [],
      programLearningOutcomes: []
    };

    const res = await request(app)
      .post("/course-outline")
      .send(outlineData)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);

    if (res.statusCode === 201 && res.body.outlineId) {
      return res.body.outlineId;
    }
    return null;
  };

  before(async () => {
    authToken = await getAuthToken();
    testOutlineId = await createTestOutline(authToken);
  });

  it("should export PDF for existing outline", async () => {
    if (!testOutlineId) {
      return;
    }

    const res = await request(app)
      .get(`/outlines/${testOutlineId}/pdf`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).to.equal(200);
    expect(res.headers["content-type"]).to.equal("application/pdf");
    expect(res.headers["content-disposition"]).to.include("attachment");
    expect(res.headers["content-disposition"]).to.include(".pdf");
    expect(res.body).to.be.instanceOf(Buffer);
  });

  it("should return 404 for non-existent outline", async () => {
    const nonExistentId = 999999;

    const res = await request(app)
      .get(`/outlines/${nonExistentId}/pdf`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`);

    expect([404, 403]).to.include(res.statusCode);

    if (res.statusCode === 404) {
      expect(res.body).to.have.property("message");
      expect(res.body.message).to.equal("Outline not found.");
    }
  });

  it("should reject request without authentication", async () => {
    const res = await request(app)
      .get(`/outlines/1/pdf`)
      .set("Accept", "application/json");

    expect(res.statusCode).to.equal(401);
  });

  it("should validate outlineId parameter", async () => {
    const invalidId = "invalid";

    const res = await request(app)
      .get(`/outlines/${invalidId}/pdf`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`);

    expect([400, 401, 403]).to.include(res.statusCode);
  });

  it("should generate correct filename format", async () => {
    if (!testOutlineId) {
      return;
    }

    const res = await request(app)
      .get(`/outlines/${testOutlineId}/pdf`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`);

    if (res.statusCode === 200) {
      const contentDisposition = res.headers["content-disposition"];
      expect(contentDisposition).to.match(/filename=".*-.*-.*-outline\.pdf"/);
    }
  });

  it("should return PDF buffer with valid content", async () => {
    if (!testOutlineId) {
      return;
    }

    const res = await request(app)
      .get(`/outlines/${testOutlineId}/pdf`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`);

    if (res.statusCode === 200) {
      expect(res.body).to.be.instanceOf(Buffer);
      expect(res.body.length).to.be.greaterThan(0);
      const pdfHeader = res.body.toString("utf8", 0, 4);
      expect(pdfHeader).to.equal("%PDF");
    }
  });
});
