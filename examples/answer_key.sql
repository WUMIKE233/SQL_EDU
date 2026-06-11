-- SQL EDU practice answer key
-- SQL EDU 练习参考答案
--
-- Run after university_schema.sql and university_data.sql.
-- 请在执行 university_schema.sql 与 university_data.sql 之后运行。

-- 1. Students enrolled in 2023 / 查询 2023 级学生
SELECT student_name, major
FROM students
WHERE enroll_year = 2023
ORDER BY student_id;

-- 2. Student-course scores / 查询每位学生选修课程和成绩
SELECT
    s.student_name,
    c.course_name,
    e.score
FROM enrollments e
JOIN students s ON e.student_id = s.student_id
JOIN courses c ON e.course_id = c.course_id
ORDER BY s.student_id, c.course_id;

-- 3. Department student counts / 统计每个院系学生人数
SELECT
    d.department_name,
    COUNT(s.student_id) AS student_count
FROM departments d
LEFT JOIN students s ON d.department_id = s.department_id
GROUP BY d.department_id, d.department_name
ORDER BY student_count DESC, d.department_name;

-- 4. Courses with average score above 90 / 查询平均分大于 90 的课程
SELECT
    c.course_name,
    ROUND(AVG(e.score), 2) AS avg_score
FROM courses c
JOIN enrollments e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name
HAVING AVG(e.score) > 90
ORDER BY avg_score DESC;

-- 5. Rank students within each course / 使用窗口函数计算课程内排名
SELECT
    e.course_id,
    c.course_name,
    s.student_name,
    e.score,
    RANK() OVER (PARTITION BY e.course_id ORDER BY e.score DESC) AS rank_in_course
FROM enrollments e
JOIN students s ON e.student_id = s.student_id
JOIN courses c ON e.course_id = c.course_id
ORDER BY e.course_id, rank_in_course, s.student_id;

-- 6. Transaction exercise preview / 事务练习预览
-- ROLLBACK keeps this answer key read-safe for repeated classroom runs.
-- 使用 ROLLBACK，便于课堂中重复运行参考答案而不污染样例数据。
BEGIN;

UPDATE courses
SET selected_count = selected_count + 1
WHERE course_id = 201;

INSERT INTO enrollments (student_id, course_id, semester, score)
VALUES (2023002, 201, '2025-Fall', NULL);

SELECT
    c.course_id,
    c.course_name,
    c.selected_count,
    COUNT(e.student_id) AS actual_enrollments
FROM courses c
LEFT JOIN enrollments e ON c.course_id = e.course_id
WHERE c.course_id = 201
GROUP BY c.course_id, c.course_name, c.selected_count;

ROLLBACK;
