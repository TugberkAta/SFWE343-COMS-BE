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
VALUES (1, "Admin");

INSERT INTO user_types (user_type_id, type_name, permissions_json)
VALUES (
  1,
  "quality_assurance_head",
  JSON_ARRAY(
    "outlines.read",
    "outlines.edit",
    "outlines.download",
    "programs.read",
    "departments.read",
    "courses.read",
    "terms.read"
  )
);

INSERT INTO user_types (user_type_id, type_name, permissions_json)
VALUES (
  2,
  "quality_assurance_committee",
  JSON_ARRAY(
    "outlines.read",
    "outlines.download",
    "programs.read",
    "departments.read",
    "courses.read",
    "terms.read"
  )
);

INSERT INTO user_types (user_type_id, type_name, permissions_json)
VALUES (
  3,
  "program_leader",
  JSON_ARRAY(
    "outlines.read",
    "outlines.edit",
    "outlines.download",
    "programs.read",
    "departments.read",
    "courses.read",
    "terms.read"
  )
);

INSERT INTO user_types (user_type_id, type_name, permissions_json)
VALUES (
  4,
  "staff_member",
  JSON_ARRAY(
    "outlines.read",
    "outlines.write",
    "outlines.edit",
    "outlines.download",
    "programs.read",
    "departments.read",
    "courses.read",
    "terms.read"
  )
);

INSERT INTO users (user_id, first_name, last_name, email, password, user_role_id, created_at)
VALUES (1, "Ahmet", "Akinsql", "ahmet@akinsql.com", SHA2(CONCAT("password","SECRET_SALT"), 224), 1, "2020-11-20 12:00:00");
INSERT INTO users (user_id, first_name, last_name, email, password, user_role_id, created_at)
VALUES (2, "Joe", "Bloggs","joebloggs@gmail.com", SHA2(CONCAT("password","SECRET_SALT"), 224), null, "2020-11-20 12:00:00");
INSERT INTO users (user_id, first_name, last_name, email, password, user_role_id, created_at)
VALUES (3, "Jim", "Bloggs" , "jimbloggs@yahoo.com", SHA2(CONCAT("password","SECRET_SALT"), 224), null, "2020-11-20 12:00:00");

INSERT INTO departments (department_id, type, name)
VALUES (1, "undergraduate", "Faculty of Law");
INSERT INTO departments (department_id, type, name)
VALUES (2, "undergraduate", "Faculty of Educational Sciences");
INSERT INTO departments (department_id, type, name)
VALUES (3, "undergraduate", "Faculty of Engineering");
INSERT INTO departments (department_id, type, name)
VALUES (4, "undergraduate", "Faculty of Economics and Administrative Sciences");
INSERT INTO departments (department_id, type, name)
VALUES (5, "undergraduate", "Faculty of Arts and Sciences");
INSERT INTO departments (department_id, type, name)
VALUES (6, "undergraduate", "Faculty of Architecture and Fine Arts");
INSERT INTO departments (department_id, type, name)
VALUES (7, "undergraduate", "Faculty of Health Sciences");
INSERT INTO departments (department_id, type, name)
VALUES (8, "undergraduate", "Faculty of Dentistry");
INSERT INTO departments (department_id, type, name)
VALUES (9, "undergraduate", "Faculty of Pharmacy");
INSERT INTO departments (department_id, type, name)
VALUES (10, "masters", "Institute of Graduate Studies");
INSERT INTO departments (department_id, type, name)
VALUES (11, "phd", "Institute of Graduate Studies");

INSERT INTO programs (program_id, department_id, name, language)
VALUES (1, 1, "Law", "Turkish");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (2, 1, "International Law", "English");

INSERT INTO programs (program_id, department_id, name, language)
VALUES (3, 2, "Pre-School Teaching", "Turkish");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (4, 2, "Guidance and Psychological Counselling", "Turkish");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (5, 2, "English Language Teaching", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (6, 2, "Turkish Language Teaching", "Turkish");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (7, 2, "Elementary Mathematics Teaching", "Turkish");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (8, 2, "Special Education Teaching", "Turkish");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (9, 2, "Classroom Teaching", "Turkish");

INSERT INTO programs (program_id, department_id, name, language)
VALUES (10, 3, "Electrical and Electronic Engineering", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (11, 3, "Computer Engineering", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (12, 3, "Civil Engineering", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (13, 3, "Software Engineering", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (14, 3, "Artificial Intelligence Engineering", "English");

INSERT INTO programs (program_id, department_id, name, language)
VALUES (15, 4, "Banking, Finance & Accounting", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (16, 4, "Business Administration", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (17, 4, "Business Administration (Enterprise) with Ulster University", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (18, 4, "Business Administration (Marketing) with Ulster University", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (19, 4, "Economics", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (20, 4, "International Finance and Banking", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (21, 4, "International Trade and Business", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (22, 4, "Management Information Systems (MIS)", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (23, 4, "Political Science and International Relations", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (24, 4, "Marketing (Digital Media)", "English");

INSERT INTO programs (program_id, department_id, name, language)
VALUES (25, 5, "Psychology", "Turkish");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (26, 5, "Psychology", "English");

INSERT INTO programs (program_id, department_id, name, language)
VALUES (27, 6, "Architecture", "English");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (28, 6, "Interior Architecture", "English");

INSERT INTO programs (program_id, department_id, name, language)
VALUES (29, 7, "Nursing", "Turkish");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (30, 7, "Nutrition and Dietetics", "Turkish");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (31, 7, "Physiotherapy and Rehabilitation", "Turkish");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (32, 7, "Physiotherapy and Rehabilitation", "English");

INSERT INTO programs (program_id, department_id, name, language)
VALUES (33, 8, "Dentistry", "Turkish");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (34, 8, "Dentistry", "English");

INSERT INTO programs (program_id, department_id, name, language)
VALUES (35, 9, "Pharmacy", "Turkish");
INSERT INTO programs (program_id, department_id, name, language)
VALUES (36, 9, "Pharmacy", "English");

INSERT INTO courses (
  course_id, program_id, code, name, language, course_level_text, category,
  theory_hours, tutorial_hours, lab_hours, local_credits, ects_credits
) VALUES
  (1, 11, "MATH121", "CALCULUS-I", "English", "Semester 1", "faculty_core", 3, 2, 0, 4, 6),
  (2, 11, "MATH123", "DISCRETE MATHEMATICS", "English", "Semester 1", "faculty_core", 3, 1, 0, 3, 5),
  (3, 11, "PHYS121", "PHYSICS-I", "English", "Semester 1", "faculty_core", 3, 1, 1, 4, 5),
  (4, 11, "ENGR101", "INFORMATION TECHNOLOGY AND APPLICATIONS", "English", "Semester 1", "faculty_core", 2, 0, 1, 2, 2),
  (5, 11, "ENGR103", "COMPUTER PROGRAMMING-I", "English", "Semester 1", "faculty_core", 2, 0, 2, 3, 5),
  (6, 11, "ENGL121", "ENGLISH-I", "English", "Semester 1", "university_core", 3, 0, 0, 3, 4),
  (7, 11, "TUOG101_TURK131", "TURKISH LANGUAGE-I / TURKISH AS A FOREIGN LANGUAGE-I", "English", "Semester 1", "university_core", 2, 0, 0, 2, 3),
  (8, 11, "MATH122", "CALCULUS-II", "English", "Semester 2", "faculty_core", 3, 2, 0, 4, 6),
  (9, 11, "MATH124", "LINEAR ALGEBRA", "English", "Semester 2", "faculty_core", 3, 1, 0, 3, 5),
  (10, 11, "PHYS122", "PHYSICS-II", "English", "Semester 2", "faculty_core", 3, 1, 1, 4, 5),
  (11, 11, "ENGR104", "COMPUTER PROGRAMMING-II", "English", "Semester 2", "faculty_core", 2, 0, 2, 3, 4),
  (12, 11, "ENGL122", "ENGLISH-II", "English", "Semester 2", "university_core", 3, 0, 0, 3, 4),
  (13, 11, "TARH101_HIST111", "ATATURK'S PRINCIPLES AND HISTORY OF TURKISH REFORMS-I", "English", "Semester 2", "university_core", 2, 0, 0, 2, 3),
  (14, 11, "TUOG102_TURK132", "TURKISH LANGUAGE-II / TURKISH AS A FOREIGN LANGUAGE-II", "English", "Semester 2", "university_core", 2, 0, 0, 2, 3),
  (15, 11, "ELEE211", "DIGITAL LOGIC DESIGN", "English", "Semester 3", "area_core", 3, 0, 2, 4, 6),
  (16, 11, "ELEE231", "CIRCUIT THEORY-I", "English", "Semester 3", "area_core", 3, 0, 2, 4, 6),
  (17, 11, "CMPE215", "ALGORITHMS AND DATA STRUCTURES", "English", "Semester 3", "area_core", 3, 0, 1, 3, 6),
  (18, 11, "MATH225", "DIFFERENTIAL EQUATIONS", "English", "Semester 3", "faculty_core", 4, 0, 0, 4, 5),
  (19, 11, "TARH102_HIST112", "ATATURK'S PRINCIPLES AND HISTORY OF TURKISH REFORMS-II", "English", "Semester 3", "university_core", 2, 0, 0, 2, 3),
  (20, 11, "UNIEXX1", "UNIVERSITY ELECTIVE", "English", "Semester 3", "university_elective", 0, 0, 0, 3, 4),
  (21, 11, "STAT226", "PROBABILITY AND STATISTICS", "English", "Semester 4", "faculty_core", 3, 1, 0, 3, 6),
  (22, 11, "CMPE216", "OBJECT ORIENTED PROGRAMMING", "English", "Semester 4", "area_core", 2, 0, 2, 3, 6),
  (23, 11, "CMPE232", "OPERATING SYSTEMS", "English", "Semester 4", "area_core", 3, 0, 0, 3, 6),
  (24, 11, "CMPE252", "ANALYSIS OF ALGORITHMS", "English", "Semester 4", "area_core", 3, 0, 2, 4, 6),
  (25, 11, "ENGR215", "RESEARCH METHODS FOR ENGINEERING AND ARCHITECTURE", "English", "Semester 4", "faculty_core", 2, 0, 0, 2, 3),
  (26, 11, "OHSA206", "OCCUPATIONAL HEALTH AND SAFETY", "English", "Semester 4", "faculty_core", 3, 0, 0, 3, 3),
  (27, 11, "CMPE321", "MICROPROCESSORS", "English", "Semester 5", "area_core", 3, 0, 2, 4, 6),
  (28, 11, "CMPE341", "DATABASE SYSTEMS", "English", "Semester 5", "area_core", 3, 0, 2, 4, 5),
  (29, 11, "ELEE341", "ELECTRONICS-I", "English", "Semester 5", "area_core", 3, 0, 2, 4, 5),
  (30, 11, "SFWE343", "SOFTWARE ANALYSIS AND DESIGN", "English", "Semester 5", "area_core", 2, 0, 2, 3, 5),
  (31, 11, "ENGRXX1", "FACULTY ELECTIVE", "English", "Semester 5", "faculty_elective", 0, 0, 0, 3, 5),
  (32, 11, "UNIEXX2", "UNIVERSITY ELECTIVE", "English", "Semester 5", "university_elective", 0, 0, 0, 3, 4),
  (33, 11, "MATH328", "NUMERICAL ANALYSIS", "English", "Semester 6", "faculty_core", 3, 1, 0, 3, 6),
  (34, 11, "CMPE324", "COMPUTER ARCHITECTURE", "English", "Semester 6", "area_core", 3, 0, 0, 3, 5),
  (35, 11, "CMPE322", "DATA COMMUNICATION AND COMPUTER NETWORKS", "English", "Semester 6", "area_core", 3, 0, 2, 4, 5),
  (36, 11, "ENGRXX2", "FACULTY ELECTIVE", "English", "Semester 6", "faculty_elective", 0, 0, 0, 3, 5),
  (37, 11, "ENGRXX3", "FACULTY ELECTIVE", "English", "Semester 6", "faculty_elective", 0, 0, 0, 3, 5),
  (38, 11, "UNIEXX3", "UNIVERSITY ELECTIVE", "English", "Semester 6", "university_elective", 0, 0, 0, 3, 4),
  (39, 11, "CMPE403", "SUMMER TRAINING", "English", "Semester 7", "area_core", 0, 0, 0, 0, 2),
  (40, 11, "ENGR401", "ENGINEERING DESIGN-I", "English", "Semester 7", "faculty_core", 1, 2, 0, 2, 6),
  (41, 11, "CMPE421", "PROGRAMMING LANGUAGES", "English", "Semester 7", "area_core", 3, 0, 0, 3, 6),
  (42, 11, "CMPEXX1", "AREA ELECTIVE", "English", "Semester 7", "area_elective", 0, 0, 0, 3, 6),
  (43, 11, "CMPEXX2", "AREA ELECTIVE", "English", "Semester 7", "area_elective", 0, 0, 0, 3, 6),
  (44, 11, "UNIEXX4", "UNIVERSITY ELECTIVE", "English", "Semester 7", "university_elective", 0, 0, 0, 3, 4),
  (45, 11, "ENGR402", "ENGINEERING DESIGN-II", "English", "Semester 8", "faculty_core", 0, 4, 2, 3, 10),
  (46, 11, "ENGR404", "ENGINEERING ATTRIBUTES AND ETHICS", "English", "Semester 8", "faculty_core", 2, 0, 0, 2, 3),
  (47, 11, "ENGRXX4", "FACULTY ELECTIVE", "English", "Semester 8", "faculty_elective", 0, 0, 0, 3, 5),
  (48, 11, "CMPEXX3", "AREA ELECTIVE", "English", "Semester 8", "area_elective", 0, 0, 0, 3, 6),
  (49, 11, "CMPEXX4", "AREA ELECTIVE", "English", "Semester 8", "area_elective", 0, 0, 0, 3, 6),
  (50, 11, "CMPE422", "REAL-TIME SYSTEMS", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (51, 11, "CMPE431", "ADVANCED COMPUTER NETWORKS", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (52, 11, "CMPE432", "WIRELESS COMMUNICATION NETWORKS", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (53, 11, "CMPE433", "WIRELESS SENSOR NETWORKS", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (54, 11, "CMPE434", "INFORMATION AND NETWORK SECURITY", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (55, 11, "CMPE455", "MODERN PROGRAMMING PLATFORMS", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (56, 11, "CMPE461", "COMPUTING SYSTEMS", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (57, 11, "CMPE462", "SERVICE-ORIENTED COMPUTING", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (58, 11, "CMPE463", "CLOUD COMPUTING", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (59, 11, "CMPE464", "ARTIFICIAL INTELLIGENCE", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (60, 11, "CMPE465", "NEURAL NETWORKS", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (61, 11, "CMPE466", "EXPERT SYSTEMS", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (62, 11, "CMPE474", "INTRODUCTION TO PARALLEL COMPUTING", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (63, 11, "CMPE475", "ARTIFICIAL INTELLIGENCE TOOLS", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (64, 11, "CMPE476", "DIGITAL FORENSICS AND INVESTIGATIONS", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (65, 11, "ELEE426", "EMBEDDED SYSTEMS", "English", "Area Elective Pool", "area_elective", 3, 0, 0, 3, 6),
  (66, 11, "CHEM121", "CHEMISTRY", "English", "Faculty Elective Pool", "faculty_elective", 2, 2, 1, 3, 5),
  (67, 11, "MATH228", "ENGINEERING MATHEMATICS", "English", "Faculty Elective Pool", "faculty_elective", 3, 1, 0, 3, 6),
  (68, 11, "ELEE331", "SIGNALS AND SYSTEMS", "English", "Faculty Elective Pool", "faculty_elective", 3, 0, 2, 4, 6),
  (69, 11, "ELEE362", "COMMUNICATION SYSTEMS", "English", "Faculty Elective Pool", "faculty_elective", 3, 0, 2, 4, 6),
  (70, 11, "ELEE431", "DIGITAL SIGNAL PROCESSING", "English", "Faculty Elective Pool", "faculty_elective", 3, 0, 1, 3, 6),
  (71, 11, "SFWE315", "VISUAL PROGRAMMING", "English", "Faculty Elective Pool", "faculty_elective", 2, 0, 2, 3, 6),
  (72, 11, "SFWE316", "INTERNET AND WEB PROGRAMMING", "English", "Faculty Elective Pool", "faculty_elective", 2, 0, 2, 3, 6),
  (73, 11, "SFWE415", "SOFTWARE ARCHITECTURE", "English", "Faculty Elective Pool", "faculty_elective", 3, 0, 1, 3, 6),
  (74, 11, "SFWE411", "SOFTWARE VALIDATION & TESTING", "English", "Faculty Elective Pool", "faculty_elective", 2, 0, 2, 3, 6),
  (75, 11, "SFWE412", "SOFTWARE QUALITY ASSURANCE", "English", "Faculty Elective Pool", "faculty_elective", 3, 0, 0, 3, 6),
  (76, 11, "AINE301", "BASIC SEARCH METHODS", "English", "Faculty Elective Pool", "faculty_elective", 2, 0, 2, 3, 5),
  (77, 11, "AINE312", "DATA SCIENCE", "English", "Faculty Elective Pool", "faculty_elective", 3, 0, 0, 3, 5),
  (78, 11, "AINE334", "KNOWLEDGE REPRESENTATION AND REASONING", "English", "Faculty Elective Pool", "faculty_elective", 3, 0, 0, 3, 5);

INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (8, 1);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (10, 3);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (11, 5);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (12, 6);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (14, 7);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (16, 9);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (16, 10);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (17, 11);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (18, 1);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (18, 9);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (21, 1);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (22, 11);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (23, 11);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (24, 17);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (27, 15);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (28, 17);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (29, 16);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (30, 22);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (33, 9);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (33, 18);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (34, 15);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (35, 17);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (41, 22);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (45, 40);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (63, 59);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (67, 9);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (67, 8);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (69, 68);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (71, 17);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (72, 22);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (73, 30);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (74, 30);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (76, 9);
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (77, 11);

INSERT INTO terms (term_id, academic_year, semester, start_date, end_date)
VALUES (1, "2024-2025", "fall", "2024-09-16", "2025-01-10");
INSERT INTO terms (term_id, academic_year, semester, start_date, end_date)
VALUES (2, "2024-2025", "spring", "2025-02-17", "2025-06-13");
INSERT INTO terms (term_id, academic_year, semester, start_date, end_date)
VALUES (3, "2025-2026", "fall", "2025-09-15", "2026-01-09");
INSERT INTO terms (term_id, academic_year, semester, start_date, end_date)
VALUES (4, "2025-2026", "spring", "2026-02-16", "2026-06-12");

INSERT INTO course_outlines (
  outline_id, course_id, term_id, version_no, status, lecturer_user_id,
  textbooks_text, additional_reading_text,
  created_by_user_id, created_at, updated_at
) VALUES (
  1, 30, 4, 1, "published", 1,
  "System Analysis and Design, 11th Edition, Julie E. Kendall and Kenneth E. Kendall.",
  "Course pack prepared by the instructor.",
  1, "2026-02-10 09:00:00", "2026-02-10 09:00:00"
);

INSERT INTO outline_assistants (outline_id, assistant_user_id)
VALUES (1, 2);
INSERT INTO outline_assistants (outline_id, assistant_user_id)
VALUES (1, 3);

INSERT INTO outline_objectives (objective_id, outline_id, objective_order, objective_text)
VALUES (1, 1, 1, "To provide students with the theoretical foundation and practical skills necessary for analyzing software requirements, modeling system design with UML, and applying project management principles in software development.");
INSERT INTO outline_objectives (objective_id, outline_id, objective_order, objective_text)
VALUES (2, 1, 2, "To enable students to collaborate effectively in teams, develop functioning software applications, and produce professional documentation that communicates design and implementation outcomes to both technical and non-technical audiences.");

INSERT INTO outline_content_items (content_item_id, outline_id, content_order, content_text)
VALUES (1, 1, 1, "Systems, Roles, and Development Methodologies");
INSERT INTO outline_content_items (content_item_id, outline_id, content_order, content_text)
VALUES (2, 1, 2, "Understanding and Modeling Organizational Systems");
INSERT INTO outline_content_items (content_item_id, outline_id, content_order, content_text)
VALUES (3, 1, 3, "Project Management and Development");
INSERT INTO outline_content_items (content_item_id, outline_id, content_order, content_text)
VALUES (4, 1, 4, "Information Gathering Methods");
INSERT INTO outline_content_items (content_item_id, outline_id, content_order, content_text)
VALUES (5, 1, 5, "Agile Modeling, Prototyping, and Scrum");
INSERT INTO outline_content_items (content_item_id, outline_id, content_order, content_text)
VALUES (6, 1, 6, "Software Documentation and Security");

INSERT INTO outline_workload_items (
  workload_item_id, outline_id, item_order, activity_type, learning_activities_weeks, duration_hours
) VALUES (1, 1, 1, "Lecture time (week: 14 x periods per week)", 14, 4);
INSERT INTO outline_workload_items (
  workload_item_id, outline_id, item_order, activity_type, learning_activities_weeks, duration_hours
) VALUES (2, 1, 2, "Out of class study time (14xstudy time per week)", 14, 4);
INSERT INTO outline_workload_items (
  workload_item_id, outline_id, item_order, activity_type, learning_activities_weeks, duration_hours
) VALUES (3, 1, 3, "Time spent studying for the quiz", 1, 3);
INSERT INTO outline_workload_items (
  workload_item_id, outline_id, item_order, activity_type, learning_activities_weeks, duration_hours
) VALUES (4, 1, 4, "Homework / Assignments", 3, 3);
INSERT INTO outline_workload_items (
  workload_item_id, outline_id, item_order, activity_type, learning_activities_weeks, duration_hours
) VALUES (5, 1, 5, "Preparation of Software Development Project", 1, 15);
INSERT INTO outline_workload_items (
  workload_item_id, outline_id, item_order, activity_type, learning_activities_weeks, duration_hours
) VALUES (6, 1, 6, "Preparation for Midterm Exam", 1, 10);
INSERT INTO outline_workload_items (
  workload_item_id, outline_id, item_order, activity_type, learning_activities_weeks, duration_hours
) VALUES (7, 1, 7, "Preparation for Final Exam", 0, 0);

INSERT INTO outline_evaluation_items (
  evaluation_item_id, outline_id, item_order, name, category, weight_percent, notes
) VALUES (1, 1, 1, "Quiz", "quiz", 5.00, "Initial seed distribution for SFWE343 outline.");
INSERT INTO outline_evaluation_items (
  evaluation_item_id, outline_id, item_order, name, category, weight_percent, notes
) VALUES (2, 1, 2, "Homework / Assignments", "assignment", 15.00, "Initial seed distribution for SFWE343 outline.");
INSERT INTO outline_evaluation_items (
  evaluation_item_id, outline_id, item_order, name, category, weight_percent, notes
) VALUES (3, 1, 3, "Software Development Project", "project", 30.00, "Initial seed distribution for SFWE343 outline.");
INSERT INTO outline_evaluation_items (
  evaluation_item_id, outline_id, item_order, name, category, weight_percent, notes
) VALUES (4, 1, 4, "Midterm Exam", "midterm", 20.00, "Initial seed distribution for SFWE343 outline.");
INSERT INTO outline_evaluation_items (
  evaluation_item_id, outline_id, item_order, name, category, weight_percent, notes
) VALUES (5, 1, 5, "Final Exam", "final", 30.00, "Initial seed distribution for SFWE343 outline.");

INSERT INTO outline_learning_outcomes (clo_id, outline_id, clo_number, statement)
VALUES (1, 1, 1, "Explain and evaluate the role, responsibilities, and required skills of the system analyst in software development projects.");
INSERT INTO outline_learning_outcomes (clo_id, outline_id, clo_number, statement)
VALUES (2, 1, 2, "Gather, analyze, and document software requirements using appropriate techniques and prepare a comprehensive Software Requirements Specification (SRS).");
INSERT INTO outline_learning_outcomes (clo_id, outline_id, clo_number, statement)
VALUES (3, 1, 3, "Apply UML modeling techniques (e.g., use case, activity, class, sequence, state chart, package, deployment diagrams) to represent and refine software design.");
INSERT INTO outline_learning_outcomes (clo_id, outline_id, clo_number, statement)
VALUES (4, 1, 4, "Collaborate in teams to design and implement a functioning software application, demonstrating project management practices and leadership in a development environment.");
INSERT INTO outline_learning_outcomes (clo_id, outline_id, clo_number, statement)
VALUES (5, 1, 5, "Produce professional project documentation that communicates design decisions, implementation details, and evaluation results clearly to technical and non-technical audiences.");

INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (1, 1, 1, "Systems, Roles, and Development Methodologies", "Understand the need for systems analysis and design in organizations; comprehend the fundamentals of the systems development life cycle.", "Application: PowerPoint Slides.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (2, 1, 2, "Understanding and Modeling Organizational Systems", "Levels of management, design of organizations, and organizational cultures.", "Application: PowerPoint Slides.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (3, 1, 3, "Project Management", "Understand how projects are initiated and selected; demonstrate project scheduling.", "Application: PowerPoint Slides and collaborative platforms (JIRA, Asana, Trello).");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (4, 1, 4, "Information Gathering - Interactive Methods", "Construct meaningful interview questions; understand listening to user stories and their use in analysis.", "Application: PowerPoint Slides and Leximancer.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (5, 1, 5, "Information Gathering - Unobtrusive Methods", "Analyze quantitative documents and interpret messages, interviews, and communications via text analytics.", "Application: PowerPoint Slides and Google Forms.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (6, 1, 6, "Agile Modeling, Prototyping, and Scrum", "Understand agile modeling values and principles; learn about DevOps as a cultural shift in development and operations.", "Application: PowerPoint Slides and JIRA.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (7, 1, 7, "Using Data Flow Diagrams", "Create logical and physical DFDs and use them to communicate with stakeholders.", "Application: PowerPoint Slides, Microsoft Visio, and Draw.io.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (8, 1, 8, "Midterm Exams Period", "Midterm exams period.", "Application: N/A.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (9, 1, 9, "Object-Oriented Systems Analysis and Design Using UML", "Explore use case modeling; draw and explain sequence and communication diagrams.", "Application: PowerPoint Slides, Microsoft Visio, and Draw.io.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (10, 1, 10, "Designing Effective Output and Input", "Design websites and understand complexities of mobile app design.", "Application: PowerPoint Slides and lab practices.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (11, 1, 11, "Designing Databases Choices", "Databases and normalization; data warehouses and data lake concepts.", "Application: PowerPoint Slides, Beekeeper, and MySQL Workbench.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (12, 1, 12, "Human-Computer Interaction and UX Design", "Apply user experience design for customer-centered systems; design for intelligent personal assistants.", "Application: PowerPoint Slides and Figma.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (13, 1, 13, "Software Evolution", "Recognize the importance of total quality approaches to improve software design and maintenance.", "Application: PowerPoint Slides.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (14, 1, 14, "Security Engineering", "Address security, disaster preparedness, and disaster recovery concerns.", "Application: PowerPoint Slides.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (15, 1, 15, "Submission and Presentation of Projects", "Submission and presentation of team software projects.", "Application: Project presentation.");
INSERT INTO outline_weekly_topics (weekly_topic_id, outline_id, week_no, subject_title, details_text, tasks_private_study_text)
VALUES (16, 1, 16, "Final Exams Period", "Final exams period.", "Application: N/A.");

INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (1, 1);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (2, 1);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (3, 4);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (4, 2);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (5, 2);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (6, 2);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (6, 4);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (7, 3);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (9, 3);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (10, 3);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (11, 3);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (12, 3);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (13, 5);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (14, 5);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (15, 4);
INSERT INTO outline_weekly_topic_clos (weekly_topic_id, clo_id) VALUES (15, 5);

INSERT INTO outline_policies (policy_id, policy_order, title, body_text)
VALUES (1, 1, "Attendance", "Students are expected to attend all classes, studio/lab sessions, and project meetings unless excused.");
INSERT INTO outline_policies (policy_id, policy_order, title, body_text)
VALUES (2, 2, "Academic Integrity", "All submissions must be original. Plagiarism and unauthorized collaboration are handled under university regulations.");
INSERT INTO outline_policies (policy_id, policy_order, title, body_text)
VALUES (3, 3, "Project Work", "Project milestones and final presentations must be submitted on time. Team contribution is expected and may be individually reviewed.");

INSERT INTO outline_reference_links (reference_link_id, link_order, label, url)
VALUES (1, 1, "Course Specification (SFWE343)", "https://fiu.edu.tr/");