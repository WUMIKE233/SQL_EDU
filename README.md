# SQL EDU

[中文](#中文说明) | [English](#english)

## 中文说明

`SQL EDU` 是一套面向本科生的 SQL 教材草稿，强调“概念清晰、例子可运行、练习可落地”。仓库内容默认以标准 SQL 为主，同时参考 PostgreSQL 常见写法，适合作为数据库原理、数据库应用、数据管理基础等课程的配套材料。

### 适用对象

- 本科阶段初学数据库的学生
- 需要快速搭建 SQL 课程资料的教师或助教
- 希望通过案例系统学习 SQL 的自学者

### 仓库结构

- `book/`：教材正文与课程章节
- `examples/`：示例数据库、测试数据与练习脚本
- `examples/self_check.sql`：练习后的数据完整性自检脚本
- `examples/answer_key.sql`：课堂练习参考答案，事务题默认回滚，便于重复运行

### 学习路径建议

1. 先阅读 `book/00-前言.md` 和 `book/SUMMARY.md`
2. 按章节顺序完成 DDL、查询、更新、事务与设计部分
3. 配合 `examples/` 中的脚本在本地数据库中练习
4. 最后完成 `book/09-综合实验与课程项目.md` 中的课程项目

### 推荐环境

- PostgreSQL 14+ 或更高版本
- DBeaver、pgAdmin、DataGrip 等任一 SQL 客户端

### 开源许可

本仓库采用 `MIT License`。

---

## English

`SQL EDU` is an open-source SQL textbook draft designed for undergraduate students. It focuses on clear concepts, runnable examples, and hands-on exercises. The content is primarily written in standard SQL with PostgreSQL-friendly examples, making it suitable for introductory database courses.

### Target audience

- Undergraduate students learning databases for the first time
- Instructors or TAs building teaching materials for SQL courses
- Self-learners who want a structured path through SQL fundamentals

### Repository structure

- `book/`: textbook chapters and course materials
- `examples/`: sample schema, seed data, and practice SQL
- `examples/self_check.sql`: post-practice data integrity self-check queries
- `examples/answer_key.sql`: answer key for practice queries; the transaction exercise rolls back by default for repeatable classroom runs

### Suggested learning path

1. Start with `book/00-前言.md` and `book/SUMMARY.md`
2. Study DDL, querying, updates, transactions, and design in order
3. Run the scripts under `examples/` in a local database
4. Finish with the course project in `book/09-综合实验与课程项目.md`

### Recommended environment

- PostgreSQL 14 or later
- Any SQL client such as DBeaver, pgAdmin, or DataGrip

### License

This repository is released under the `MIT License`.
