-- SQL EDU self-check queries
-- SQL EDU 自检脚本
--
-- Run this file after university_schema.sql and university_data.sql.
-- 请在执行 university_schema.sql 与 university_data.sql 之后运行本文件。

-- 1. Table row counts / 表行数检查
SELECT 'departments' AS table_name, COUNT(*) AS row_count FROM departments
UNION ALL
SELECT 'students' AS table_name, COUNT(*) AS row_count FROM students
UNION ALL
SELECT 'courses' AS table_name, COUNT(*) AS row_count FROM courses
UNION ALL
SELECT 'enrollments' AS table_name, COUNT(*) AS row_count FROM enrollments
ORDER BY table_name;

-- 2. Orphan enrollment check / 选课记录孤儿数据检查
SELECT
    e.student_id,
    e.course_id,
    CASE
        WHEN s.student_id IS NULL THEN 'missing student'
        WHEN c.course_id IS NULL THEN 'missing course'
        ELSE 'ok'
    END AS check_result
FROM enrollments e
LEFT JOIN students s ON e.student_id = s.student_id
LEFT JOIN courses c ON e.course_id = c.course_id
WHERE s.student_id IS NULL OR c.course_id IS NULL;

-- 3. Score range check / 成绩范围检查
SELECT
    student_id,
    course_id,
    score
FROM enrollments
WHERE score IS NOT NULL
  AND (score < 0 OR score > 100);

-- 4. Department summary / 院系统计摘要
SELECT
    d.department_name,
    COUNT(DISTINCT s.student_id) AS student_count,
    COUNT(DISTINCT c.course_id) AS course_count
FROM departments d
LEFT JOIN students s ON d.department_id = s.department_id
LEFT JOIN teachers t ON d.department_id = t.department_id
LEFT JOIN courses c ON t.teacher_id = c.teacher_id
GROUP BY d.department_id, d.department_name
ORDER BY d.department_name;
