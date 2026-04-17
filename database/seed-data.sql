/* Initialize DB with some seed data */
USE `coms_be_db`;

-- DONT MODIFY THIS MIGRATION
-- it is used by Xest local development pipeline
INSERT INTO `migrations` (
  name,
  run_on
) VALUES (
  "/20211107064324-seed-data",
  "20211107064324"
);

-- YOU CAN MODIFY BELOW THIS LINE
INSERT INTO user_roles (user_role_id, user_role)
VALUES (1, "admin");
INSERT INTO user_roles (user_role_id, user_role)
VALUES (2, "Quality Assurance - Head");
INSERT INTO user_roles (user_role_id, user_role)
VALUES (3, "Quality Assurance - Committee");
INSERT INTO user_roles (user_role_id, user_role)
VALUES (4, "Program Leader");
INSERT INTO user_roles (user_role_id, user_role)
VALUES (5, "Staff Member");

INSERT INTO users (user_id, first_name, last_name, email, password, user_role_id, created_at)
VALUES (1, "Ahmet", "Akinsql", "ahmet@akinsql.com", SHA2(CONCAT("password","SECRET_SALT"), 224), 1, "2020-11-20 12:00:00");
INSERT INTO users (user_id, first_name, last_name, email, password, user_role_id, created_at)
VALUES (2, "Joe", "Bloggs","joebloggs@gmail.com", SHA2(CONCAT("password","SECRET_SALT"), 224), 2, "2020-11-20 12:00:00");
INSERT INTO users (user_id, first_name, last_name, email, password, user_role_id, created_at)
VALUES (3, "Jim", "Bloggs" , "jimbloggs@yahoo.com", SHA2(CONCAT("password","SECRET_SALT"), 224), null, "2020-11-20 12:00:00");

INSERT INTO departments (code, name)
VALUES ("CS", "Computer Science");

INSERT INTO programs (department_id, name, degree_level)
VALUES (1, "Software Engineering", "undergraduate");

INSERT INTO terms (academic_year, semester, start_date, end_date)
VALUES ("2026-2027", "fall", "2026-09-01", "2027-01-15");

INSERT INTO courses (program_id, code, name, category, local_credits, ects_credits)
VALUES (1, "SFWE101", "Introduction to Software Engineering", "area_core", 3.0, 6.0);