USE `coms_be_db`;

-- DONT MODIFY THIS MIGRATION
-- it is used by Xest local development pipeline
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `run_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `migrations` (
  name,
  run_on
) VALUES (
  "/20211107064324-database-schema",
  "20211107064324"
);

-- YOU CAN MODIFY BELOW THIS LINE
DROP TABLE IF EXISTS user_roles;
CREATE TABLE user_roles(
  user_role_id int AUTO_INCREMENT PRIMARY KEY,
  user_role VARCHAR(50) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS users;
CREATE TABLE users(
  user_id int AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(500) NOT NULL,
  user_role_id int NULL DEFAULT NULL,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_role_id) REFERENCES user_roles(user_role_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE departments(
  department_id int AUTO_INCREMENT PRIMARY KEY,
  type ENUM('undergraduate','masters','phd') NOT NULL,
  name VARCHAR(150) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE programs(
  program_id int AUTO_INCREMENT PRIMARY KEY,
  department_id int NOT NULL,
  name VARCHAR(150) NOT NULL,
  language ENUM('English','Turkish') NOT NULL DEFAULT 'English',
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE terms(
  term_id int AUTO_INCREMENT PRIMARY KEY,
  academic_year VARCHAR(9) NOT NULL,
  semester ENUM('fall','spring','summer') NOT NULL,
  start_date DATE,
  end_date DATE,
  UNIQUE (academic_year, semester)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE courses(
  course_id int AUTO_INCREMENT PRIMARY KEY,
  program_id int NOT NULL,
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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE course_prerequisites(
  course_id int NOT NULL,
  prerequisite_course_id int NOT NULL,
  PRIMARY KEY (course_id, prerequisite_course_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  FOREIGN KEY (prerequisite_course_id) REFERENCES courses(course_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE course_outlines(
  outline_id int AUTO_INCREMENT PRIMARY KEY,
  course_id int NOT NULL,
  term_id int NOT NULL,
  version_no int NOT NULL DEFAULT 1,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  lecturer_user_id int NOT NULL,
  assistant_user_id int,
  aims_objectives_text TEXT,
  content_text TEXT,
  textbooks_text TEXT,
  additional_reading_text TEXT,
  created_by_user_id int NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (course_id, term_id, version_no),
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  FOREIGN KEY (term_id) REFERENCES terms(term_id),
  FOREIGN KEY (lecturer_user_id) REFERENCES users(user_id),
  FOREIGN KEY (assistant_user_id) REFERENCES users(user_id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_objectives(
  objective_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  objective_order TINYINT NOT NULL,
  objective_text TEXT NOT NULL,
  UNIQUE (outline_id, objective_order),
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_content_items(
  content_item_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  content_order TINYINT NOT NULL,
  content_text TEXT NOT NULL,
  UNIQUE (outline_id, content_order),
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_workload_items(
  workload_item_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  item_order TINYINT NOT NULL,
  activity_type VARCHAR(120) NOT NULL,
  learning_activities_weeks TINYINT NOT NULL DEFAULT 0,
  duration_hours DECIMAL(5,2) NOT NULL DEFAULT 0,
  UNIQUE (outline_id, item_order),
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_evaluation_processes(
  evaluation_process_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  name VARCHAR(120) NOT NULL,
  stage ENUM('QA-HEAD','QA-COMMITTEE','PROGRAM-LEADER') NOT NULL,
  notes TEXT,
  description TEXT,
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_evaluation_items(
  evaluation_item_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  item_order TINYINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  category ENUM('midterm','final','quiz','assignment','project','lab','participation','other') NOT NULL DEFAULT 'other',
  weight_percent DECIMAL(5,2) NOT NULL,
  notes TEXT,
  UNIQUE (outline_id, item_order),
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE course_outline_versions(
  course_outline_version_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  snapshot_json JSON NOT NULL,
  change_note VARCHAR(255),
  created_by_user_id int NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE,
  FOREIGN KEY (created_by_user_id) REFERENCES users(user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_schedule_slots(
  slot_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  slot_type ENUM('lecture','office_hour') NOT NULL,
  day_of_week ENUM('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes VARCHAR(200),
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_learning_outcomes(
  clo_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  clo_number TINYINT NOT NULL,
  domain ENUM('knowledge','skill','competency'),
  statement TEXT NOT NULL,
  UNIQUE (outline_id, clo_number),
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_evaluation_item_clos(
  evaluation_item_id int NOT NULL,
  clo_id int NOT NULL,
  PRIMARY KEY (evaluation_item_id, clo_id),
  FOREIGN KEY (evaluation_item_id) REFERENCES outline_evaluation_items(evaluation_item_id) ON DELETE CASCADE,
  FOREIGN KEY (clo_id) REFERENCES outline_learning_outcomes(clo_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_weekly_topics(
  weekly_topic_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  week_no TINYINT NOT NULL,
  week_date DATE,
  subject_title VARCHAR(255) NOT NULL,
  details_text TEXT,
  tasks_private_study_text TEXT,
  UNIQUE (outline_id, week_no),
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_weekly_topic_clos(
  weekly_topic_id int NOT NULL,
  clo_id int NOT NULL,
  PRIMARY KEY (weekly_topic_id, clo_id),
  FOREIGN KEY (weekly_topic_id) REFERENCES outline_weekly_topics(weekly_topic_id) ON DELETE CASCADE,
  FOREIGN KEY (clo_id) REFERENCES outline_learning_outcomes(clo_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_policies(
  policy_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  policy_order TINYINT NOT NULL,
  title VARCHAR(150) NOT NULL,
  body_text TEXT NOT NULL,
  UNIQUE (outline_id, policy_order),
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_reference_links(
  reference_link_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  link_order TINYINT NOT NULL,
  label VARCHAR(150) NOT NULL,
  url VARCHAR(500) NOT NULL,
  UNIQUE (outline_id, link_order),
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_workload_items(
  workload_item_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  item_order TINYINT NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  learning_activities_weeks TINYINT NOT NULL,
  duration_hours SMALLINT NOT NULL,
  UNIQUE (outline_id, item_order),
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_evaluation_items(
  evaluation_item_id int AUTO_INCREMENT PRIMARY KEY,
  outline_id int NOT NULL,
  item_order TINYINT NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  weight_percent TINYINT NOT NULL,
  notes TEXT,
  UNIQUE (outline_id, item_order),
  FOREIGN KEY (outline_id) REFERENCES course_outlines(outline_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE outline_evaluation_item_clos(
  evaluation_item_id int NOT NULL,
  clo_id int NOT NULL,
  PRIMARY KEY (evaluation_item_id, clo_id),
  FOREIGN KEY (evaluation_item_id) REFERENCES outline_evaluation_items(evaluation_item_id) ON DELETE CASCADE,
  FOREIGN KEY (clo_id) REFERENCES outline_learning_outcomes(clo_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE user_email_shortcodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  shortcode VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);