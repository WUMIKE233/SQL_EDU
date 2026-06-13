# PDF 抽取笔记

`数据库PTA习题.pdf` 共 7 页，`pypdf` 只能读取到少量页眉文字，题目主体为图片。处理方式：

1. 用 `pypdf` 提取页面嵌入图片到 `tmp/pdf_images/`。
2. 对长图按纵向裁剪到 `tmp/pdf_images/crops/` 后逐段核读。
3. 将清晰可确认的题目、答案与解析整理进 `src/data/questionBank.ts`。

当前已纳入：

- 第 12 周：存储过程、触发器、自定义函数、EXEC/OUTPUT、SQL 编程题。
- 第 13 周：规范化、函数依赖、候选码、3NF 分解。
- 第 13 周二：事务 ACID、并发异常、UNDO/REDO、检查点、数据库恢复。

未删除任何临时图片；后续如需清理 `tmp/`，请人工审核后再执行删除。
