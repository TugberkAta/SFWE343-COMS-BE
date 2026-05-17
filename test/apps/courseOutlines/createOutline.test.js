require("module-alias/register");

const { expect } = require("chai");
const request = require("supertest");
const app = require("~root/app");
const getJWTToken = require("~test/utils/getJWTToken");
const safeDescribe = require("~test/utils/safeDescribe");
const { submitQuery } = require("~root/lib/database");

const getValidOutlineData = () => ({
  courseId: 1,
  termId: 1,
  lecturerUserId: 1,
  assistantUserIds: [],
  textbooksText: "Introduction to Computer Science",
  additionalReadingText: "Advanced Topics in CS",
  officeHours: "Monday 10:00-12:00",
  officeCode: "A101",
  createdByUserId: 1,
  objectives: [
    { orderIndex: 1, statement: "Understand basic programming concepts" }
  ],
  contentItems: [{ orderIndex: 1, title: "Introduction", hours: 3 }],
  learningOutcomes: [
    {
      cloNumber: 1,
      statement: "Students will be able to write basic programs"
    },
    { cloNumber: 2, statement: "Students will be able to debug code" },
    { cloNumber: 3, statement: "Students will be able to design algorithms" },
    { cloNumber: 4, statement: "Students will be able to analyze complexity" },
    { cloNumber: 5, statement: "Students will be able to work in teams" }
  ],
  weeklyTopics: [],
  policies: [],
  referenceLinks: [],
  workloadItems: [],
  evaluationItems: [],
  programLearningOutcomes: []
});

safeDescribe("#POST /course-outline", () => {
  let adminToken;

  before(async () => {
    await submitQuery`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_role_id INT AUTO_INCREMENT PRIMARY KEY,
        user_role VARCHAR(50) NOT NULL
      );
    `;

    await submitQuery`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(500) NOT NULL,
        user_role_id INT NULL DEFAULT NULL,
        approved BOOLEAN NOT NULL DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_role_id) REFERENCES user_roles(user_role_id)
      );
    `;

    await submitQuery`
      CREATE TABLE IF NOT EXISTS departments (
        department_id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(150) NOT NULL
      );
    `;

    await submitQuery`
      CREATE TABLE IF NOT EXISTS programs (
        program_id INT AUTO_INCREMENT PRIMARY KEY,
        department_id INT NOT NULL,
        name VARCHAR(150) NOT NULL,
        degree_level ENUM('undergraduate','masters','phd') NOT NULL,
        FOREIGN KEY (department_id) REFERENCES departments(department_id)
      );
    `;

    await submitQuery`
      CREATE TABLE IF NOT EXISTS terms (
        term_id INT AUTO_INCREMENT PRIMARY KEY,
        academic_year VARCHAR(9) NOT NULL,
        semester ENUM('fall','spring','summer') NOT NULL,
        start_date DATE,
        end_date DATE,
        UNIQUE (academic_year, semester)
      );
    `;

    await submitQuery`
      CREATE TABLE IF NOT EXISTS courses (
        course_id INT AUTO_INCREMENT PRIMARY KEY,
        program_id INT NOT NULL,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        language VARCHAR(40) NOT NULL DEFAULT 'English',
        course_level_text VARCHAR(120),
        category ENUM(
          'university_core',
          'university_elective',
          'area_core',
          'area_elective',
          'faculty_core',
          'faculty_elective'
        ) NOT NULL,
        theory_hours TINYINT NOT NULL DEFAULT 0,
        tutorial_hours TINYINT NOT NULL DEFAULT 0,
        lab_hours TINYINT NOT NULL DEFAULT 0,
        local_credits DECIMAL(4,1) NOT NULL,
        ects_credits DECIMAL(4,1) NOT NULL,
        FOREIGN KEY (program_id) REFERENCES programs(program_id)
      );
    `;

    await submitQuery`
      CREATE TABLE IF NOT EXISTS course_outlines (
        outline_id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        term_id INT NOT NULL,
        version_no INT NOT NULL DEFAULT 1,
        status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
        lecturer_user_id INT NOT NULL,
        textbooks_text TEXT,
        additional_reading_text TEXT,
        office_hours VARCHAR(255),
        office_code VARCHAR(100),
        created_by_user_id INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(course_id),
        FOREIGN KEY (term_id) REFERENCES terms(term_id),
        FOREIGN KEY (lecturer_user_id) REFERENCES users(user_id),
        FOREIGN KEY (created_by_user_id) REFERENCES users(user_id)
      );
    `;

    await submitQuery`
      CREATE TABLE IF NOT EXISTS outline_objectives (
        outline_id INT NOT NULL,
        objective_order INT NOT NULL,
        objective_text TEXT NOT NULL,
        FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
      );
    `;

    await submitQuery`
      CREATE TABLE IF NOT EXISTS outline_content_items (
        outline_id INT NOT NULL,
        content_order INT NOT NULL,
        content_text TEXT NOT NULL,
        FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
      );
    `;

    await submitQuery`
      CREATE TABLE IF NOT EXISTS outline_learning_outcomes (
        clo_id INT AUTO_INCREMENT PRIMARY KEY,
        outline_id INT NOT NULL,
        clo_number INT NOT NULL,
        statement TEXT NOT NULL,
        FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
      );
    `;

    await submitQuery`
      INSERT INTO user_roles (user_role_id, user_role)
      VALUES (1, 'admin')
      ON DUPLICATE KEY UPDATE user_role_id = user_role_id;
    `;

    await submitQuery`
      INSERT INTO users (user_id, first_name, last_name, email, password, user_role_id, approved)
      VALUES (
        1,
        'Test',
        'Admin',
        'admin@test.com',
        SHA2(CONCAT('password', ${process.env.PASSWORD_SALT}), 224),
        1,
        TRUE
      )
      ON DUPLICATE KEY UPDATE user_id = user_id;
    `;

    await submitQuery`
      INSERT INTO departments (department_id, code, name)
      VALUES (1, 'ENG', 'Engineering')
      ON DUPLICATE KEY UPDATE department_id = department_id;
    `;

    await submitQuery`
      INSERT INTO programs (program_id, department_id, name, degree_level)
      VALUES (1, 1, 'Computer Engineering', 'undergraduate')
      ON DUPLICATE KEY UPDATE program_id = program_id;
    `;

    await submitQuery`
      INSERT INTO terms (term_id, academic_year, semester, start_date, end_date)
      VALUES (1, '2025-2026', 'fall', '2025-09-01', '2026-01-15')
      ON DUPLICATE KEY UPDATE term_id = term_id;
    `;

    await submitQuery`
      INSERT INTO courses (
        course_id,
        program_id,
        code,
        name,
        language,
        course_level_text,
        category,
        theory_hours,
        tutorial_hours,
        lab_hours,
        local_credits,
        ects_credits
      ) VALUES 
        (
          1,
          1,
          'COMP101',
          'Intro to Computing',
          'English',
          'Semester 1',
          'faculty_core',
          3,
          0,
          2,
          3,
          5
        ),
        (
          2,
          1,
          'COMP102',
          'Data Structures',
          'English',
          'Semester 2',
          'faculty_core',
          3,
          0,
          2,
          3,
          5
        ),
        (
          3,
          1,
          'COMP103',
          'Algorithms',
          'English',
          'Semester 3',
          'faculty_core',
          3,
          0,
          2,
          3,
          5
        ),
        (
          4,
          1,
          'COMP104',
          'Web Development',
          'English',
          'Semester 4',
          'faculty_core',
          3,
          0,
          2,
          3,
          5
        )
      ON DUPLICATE KEY UPDATE course_id = course_id;
    `;

    adminToken = await getJWTToken(1);
  });

  let courseIdCounter = 2;

  it("should create outline successfully with valid data", async () => {
    const res = await request(app)
      .post("/course-outline")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...getValidOutlineData(), courseId: courseIdCounter++ });

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property("outlineId");
    expect(res.body.outlineId).to.be.a("number");
  });

  it("should reject outline with less than 5 learning outcomes", async () => {
    const outlineData = {
      ...getValidOutlineData(),
      courseId: courseIdCounter++,
      learningOutcomes: [{ cloNumber: 1, statement: "Only one outcome" }]
    };

    const res = await request(app)
      .post("/course-outline")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(outlineData);

    expect(res.statusCode).to.equal(400);
    expect(res.body).to.be.an("array");
  });

  it("should reject request without authentication", async () => {
    const res = await request(app)
      .post("/course-outline")
      .set("Accept", "application/json")
      .send(getValidOutlineData());

    expect(res.statusCode).to.equal(401);
  });

  it("should reject outline with invalid learning outcome structure", async () => {
    const outlineData = {
      ...getValidOutlineData(),
      courseId: courseIdCounter++,
      learningOutcomes: [
        { cloNumber: "invalid", statement: "Test" },
        { cloNumber: 2, statement: "Test 2" },
        { cloNumber: 3, statement: "Test 3" },
        { cloNumber: 4, statement: "Test 4" },
        { cloNumber: 5, statement: "Test 5" }
      ]
    };

    const res = await request(app)
      .post("/course-outline")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(outlineData);

    expect(res.statusCode).to.equal(400);
    expect(res.body).to.be.an("array");
    expect(res.body[0].path).to.include("learningOutcomes");
  });
});
