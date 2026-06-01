DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    department_id INTEGER PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    office_phone VARCHAR(30)
);

CREATE TABLE teachers (
    teacher_id INTEGER PRIMARY KEY,
    teacher_name VARCHAR(100) NOT NULL,
    title VARCHAR(50) NOT NULL,
    department_id INTEGER NOT NULL,
    email VARCHAR(120) UNIQUE,
    CONSTRAINT fk_teachers_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);

CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('男', '女')),
    enroll_year INTEGER NOT NULL CHECK (enroll_year >= 2020),
    department_id INTEGER NOT NULL,
    major VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE,
    gpa NUMERIC(3, 2) CHECK (gpa >= 0 AND gpa <= 4.00),
    CONSTRAINT fk_students_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    credit NUMERIC(3, 1) NOT NULL CHECK (credit > 0 AND credit <= 10),
    teacher_id INTEGER NOT NULL,
    semester VARCHAR(20) NOT NULL,
    selected_count INTEGER NOT NULL DEFAULT 0 CHECK (selected_count >= 0),
    CONSTRAINT fk_courses_teacher
        FOREIGN KEY (teacher_id)
        REFERENCES teachers(teacher_id)
);

CREATE TABLE enrollments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    semester VARCHAR(20) NOT NULL,
    score NUMERIC(5, 2) CHECK (score >= 0 AND score <= 100),
    enrolled_at DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (student_id, course_id, semester),
    CONSTRAINT fk_enrollments_student
        FOREIGN KEY (student_id)
        REFERENCES students(student_id),
    CONSTRAINT fk_enrollments_course
        FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
);

CREATE INDEX idx_students_department_id
ON students(department_id);

CREATE INDEX idx_courses_teacher_id
ON courses(teacher_id);

CREATE INDEX idx_enrollments_course_id
ON enrollments(course_id);
