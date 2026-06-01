INSERT INTO departments (department_id, department_name, office_phone) VALUES
    (1, '计算机学院', '010-10000001'),
    (2, '数学学院', '010-10000002'),
    (3, '外国语学院', '010-10000003');

INSERT INTO teachers (teacher_id, teacher_name, title, department_id, email) VALUES
    (1001, '王敏', '教授', 1, 'wangmin@example.edu'),
    (1002, '刘洋', '副教授', 1, 'liuyang@example.edu'),
    (2001, '陈静', '教授', 2, 'chenjing@example.edu'),
    (3001, '赵雪', '讲师', 3, 'zhaoxue@example.edu');

INSERT INTO students (
    student_id, student_name, gender, enroll_year, department_id, major, email, gpa
) VALUES
    (2023001, '张三', '男', 2023, 1, '计算机科学与技术', 'zhangsan@example.edu', 3.75),
    (2023002, '李四', '女', 2023, 1, '软件工程', 'lisi@example.edu', 3.62),
    (2023003, '王五', '男', 2024, 2, '数学与应用数学', 'wangwu@example.edu', 3.88),
    (2023004, '赵六', '女', 2024, 3, '英语', 'zhaoliu@example.edu', 3.41),
    (2023005, '孙七', '男', 2023, 1, '数据科学', 'sunqi@example.edu', 3.95);

INSERT INTO courses (
    course_id, course_name, credit, teacher_id, semester, selected_count
) VALUES
    (101, '数据库原理', 3.0, 1001, '2025-Fall', 0),
    (102, 'SQL 程序设计', 2.0, 1002, '2025-Fall', 0),
    (201, '高等代数', 4.0, 2001, '2025-Fall', 0),
    (301, '学术英语', 2.0, 3001, '2025-Fall', 0);

INSERT INTO enrollments (
    student_id, course_id, semester, score, enrolled_at
) VALUES
    (2023001, 101, '2025-Fall', 91, '2025-09-01'),
    (2023001, 102, '2025-Fall', 88, '2025-09-01'),
    (2023002, 101, '2025-Fall', 85, '2025-09-02'),
    (2023003, 201, '2025-Fall', 93, '2025-09-02'),
    (2023004, 301, '2025-Fall', 82, '2025-09-03'),
    (2023005, 101, '2025-Fall', 96, '2025-09-01'),
    (2023005, 102, '2025-Fall', 94, '2025-09-01');

UPDATE courses
SET selected_count = sub.selected_count
FROM (
    SELECT course_id, COUNT(*) AS selected_count
    FROM enrollments
    GROUP BY course_id
) AS sub
WHERE courses.course_id = sub.course_id;
