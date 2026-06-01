-- 1. 查询 2023 级学生的姓名和专业
SELECT student_name, major
FROM students
WHERE enroll_year = 2023;

-- 2. 查询每位学生选修的课程和成绩
SELECT
    s.student_name,
    c.course_name,
    e.score
FROM enrollments e
JOIN students s ON e.student_id = s.student_id
JOIN courses c ON e.course_id = c.course_id
ORDER BY s.student_id, c.course_id;

-- 3. 统计每个院系的学生人数
SELECT
    d.department_name,
    COUNT(s.student_id) AS student_count
FROM departments d
LEFT JOIN students s ON d.department_id = s.department_id
GROUP BY d.department_id, d.department_name
ORDER BY student_count DESC;

-- 4. 查询平均分大于 90 的课程
SELECT
    c.course_name,
    AVG(e.score) AS avg_score
FROM courses c
JOIN enrollments e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name
HAVING AVG(e.score) > 90;

-- 5. 使用窗口函数计算课程内排名
SELECT
    e.course_id,
    s.student_name,
    e.score,
    RANK() OVER (PARTITION BY e.course_id ORDER BY e.score DESC) AS rank_in_course
FROM enrollments e
JOIN students s ON e.student_id = s.student_id
ORDER BY e.course_id, rank_in_course;

-- 6. 事务示例：新增一条选课记录并同步课程人数
BEGIN;

UPDATE courses
SET selected_count = selected_count + 1
WHERE course_id = 201;

INSERT INTO enrollments (student_id, course_id, semester, score)
VALUES (2023002, 201, '2025-Fall', NULL);

COMMIT;
