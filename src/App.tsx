import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  Filter,
  ListChecks,
  RotateCcw,
  Search,
  Settings,
  Shuffle,
  Star,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { questionBank, ReviewQuestion, topicMeta, typeLabels, QuestionType } from "./data/questionBank";

type Status = "unseen" | "known" | "wrong";

interface QuestionProgress {
  status: Status;
  starred?: boolean;
}

const STORAGE_KEY = "sql-edu-review-progress";

const typeOrder: Array<QuestionType | "all"> = ["all", "single", "true_false", "fill", "sql", "short"];

function loadProgress(): Record<string, QuestionProgress> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `00:${minutes}:${seconds}`;
}

function normalizeAnswer(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/；/g, ";")
    .replace(/，/g, ",")
    .toUpperCase();
}

function getQuestionSource(question: ReviewQuestion) {
  return `${question.source.title} · ${question.source.locator}`;
}

function App() {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [typeFilter, setTypeFilter] = useState<QuestionType | "all">("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState<Record<string, QuestionProgress>>(() => loadProgress());

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const sources = useMemo(
    () => Array.from(new Set(questionBank.map((item) => item.source.title))),
    [],
  );

  const filteredQuestions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return questionBank.filter((question) => {
      const topicMatch = selectedTopic === "all" || question.topic === selectedTopic;
      const typeMatch = typeFilter === "all" || question.type === typeFilter;
      const sourceMatch = sourceFilter === "all" || question.source.title === sourceFilter;
      const searchMatch =
        !needle ||
        question.stem.toLowerCase().includes(needle) ||
        question.tags.some((tag) => tag.toLowerCase().includes(needle)) ||
        getQuestionSource(question).toLowerCase().includes(needle);
      return topicMatch && typeMatch && sourceMatch && searchMatch;
    });
  }, [query, selectedTopic, sourceFilter, typeFilter]);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedAnswer("");
    setTextAnswer("");
    setShowAnswer(false);
  }, [query, selectedTopic, sourceFilter, typeFilter]);

  const activeIndex = filteredQuestions.length ? Math.min(currentIndex, filteredQuestions.length - 1) : 0;
  const currentQuestion = filteredQuestions[activeIndex];
  const currentProgress = currentQuestion ? progress[currentQuestion.id] : undefined;

  const stats = useMemo(() => {
    const known = Object.values(progress).filter((item) => item.status === "known").length;
    const wrong = Object.values(progress).filter((item) => item.status === "wrong").length;
    const done = known + wrong;
    const starred = Object.values(progress).filter((item) => item.starred).length;
    return {
      total: questionBank.length,
      known,
      wrong,
      done,
      starred,
      unseen: Math.max(questionBank.length - done, 0),
      accuracy: done ? Math.round((known / done) * 100) : 0,
    };
  }, [progress]);

  const topicCounts = useMemo(() => {
    return topicMeta.reduce<Record<string, number>>((acc, topic) => {
      acc[topic.id] = topic.id === "all" ? questionBank.length : questionBank.filter((q) => q.topic === topic.id).length;
      return acc;
    }, {});
  }, []);

  const answerIsCorrect = useMemo(() => {
    if (!currentQuestion) {
      return false;
    }
    if (currentQuestion.type === "single" || currentQuestion.type === "true_false") {
      return selectedAnswer === currentQuestion.correctAnswer;
    }
    const normalized = normalizeAnswer(textAnswer);
    const accepted = [currentQuestion.correctAnswer, ...(currentQuestion.acceptedAnswers ?? [])].map(normalizeAnswer);
    return Boolean(normalized) && accepted.includes(normalized);
  }, [currentQuestion, selectedAnswer, textAnswer]);

  function updateProgress(questionId: string, patch: Partial<QuestionProgress>) {
    setProgress((current) => ({
      ...current,
      [questionId]: { ...(current[questionId] ?? { status: "unseen" }), ...patch },
    }));
  }

  function goToQuestion(index: number) {
    setCurrentIndex(index);
    setSelectedAnswer("");
    setTextAnswer("");
    setShowAnswer(false);
  }

  function nextQuestion() {
    if (!filteredQuestions.length) {
      return;
    }
    goToQuestion((activeIndex + 1) % filteredQuestions.length);
  }

  function randomQuestion() {
    if (filteredQuestions.length <= 1) {
      return;
    }
    let next = Math.floor(Math.random() * filteredQuestions.length);
    if (next === activeIndex) {
      next = (next + 1) % filteredQuestions.length;
    }
    goToQuestion(next);
  }

  function resetFilters() {
    setSelectedTopic("all");
    setTypeFilter("all");
    setSourceFilter("all");
    setQuery("");
  }

  function currentStatusClass(questionId: string) {
    const status = progress[questionId]?.status ?? "unseen";
    return `jump-dot ${status}${currentQuestion?.id === questionId ? " active" : ""}`;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Database size={28} aria-hidden="true" />
          </div>
          <div>
            <h1>SQL EDU 复习题库</h1>
            <p>基于 PTA 习题与复习课件的本地答题库</p>
          </div>
        </div>
        <div className="top-actions" aria-label="复习操作">
          <button className="ghost-button" type="button" onClick={() => setShowAnswer((value) => !value)}>
            <Eye size={17} />
            {showAnswer ? "隐藏答案" : "显示答案"}
          </button>
          <button className="ghost-button" type="button" onClick={randomQuestion}>
            <Shuffle size={17} />
            随机出题
          </button>
          <div className="timer">
            <Clock3 size={17} />
            <span>{formatElapsed(elapsed)}</span>
          </div>
          <button className="icon-button" type="button" aria-label="设置">
            <Settings size={18} />
          </button>
        </div>
      </header>

      <main className="layout">
        <aside className="left-rail" aria-label="题库专题">
          <nav className="topic-list">
            {topicMeta.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className={`topic-item ${selectedTopic === topic.id ? "selected" : ""}`}
                onClick={() => setSelectedTopic(topic.id)}
                style={{ "--topic-accent": topic.accent } as React.CSSProperties}
              >
                <span className="topic-icon">
                  <BookOpen size={18} />
                </span>
                <span>
                  <strong>{topic.label}</strong>
                  <small>{topic.hint}</small>
                </span>
                <em>{topicCounts[topic.id] ?? 0}</em>
              </button>
            ))}
          </nav>

          <section className="progress-panel" aria-label="学习进度">
            <div>
              <h2>我的学习进度</h2>
              <p>{stats.done} / {stats.total} 已练习</p>
            </div>
            <div className="progress-ring" style={{ "--progress": `${stats.accuracy}%` } as React.CSSProperties}>
              <strong>{stats.accuracy}%</strong>
              <span>正确率</span>
            </div>
            <div className="stat-grid">
              <span><CheckCircle2 size={16} />正确 {stats.known}</span>
              <span><XCircle size={16} />错题 {stats.wrong}</span>
              <span><Star size={16} />收藏 {stats.starred}</span>
              <span><ListChecks size={16} />未做 {stats.unseen}</span>
            </div>
          </section>
        </aside>

        <section className="study-area">
          <div className="filter-bar">
            <label className="search-box">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索题干、标签或来源"
              />
            </label>
            <label className="select-field">
              <Filter size={16} />
              <span>题型</span>
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as QuestionType | "all")}>
                {typeOrder.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "全部" : typeLabels[type]}
                  </option>
                ))}
              </select>
            </label>
            <label className="select-field">
              <span>来源</span>
              <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
                <option value="all">全部</option>
                {sources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </label>
            <button className="ghost-button compact" type="button" onClick={resetFilters}>
              <RotateCcw size={16} />
              重置
            </button>
                <span className="question-count">题目 {filteredQuestions.length ? activeIndex + 1 : 0} / {filteredQuestions.length}</span>
          </div>

          {currentQuestion ? (
            <article className="question-card">
              <div className="question-meta">
                <span className="type-chip">{typeLabels[currentQuestion.type]}</span>
                <span>{currentQuestion.topic} · {currentQuestion.difficulty}</span>
                <span className="source-text">来源：{getQuestionSource(currentQuestion)}</span>
                <button
                  className={`star-button ${currentProgress?.starred ? "starred" : ""}`}
                  type="button"
                  onClick={() => updateProgress(currentQuestion.id, { starred: !currentProgress?.starred })}
                  aria-label={currentProgress?.starred ? "取消收藏" : "收藏本题"}
                >
                  <Star size={18} />
                </button>
              </div>

              <h2>{currentQuestion.stem}</h2>

              {(currentQuestion.type === "single" || currentQuestion.type === "true_false") && (
                <div className="options" role="radiogroup" aria-label="选项">
                  {currentQuestion.options?.map((option) => {
                    const selected = selectedAnswer === option.id;
                    const isCorrect = option.id === currentQuestion.correctAnswer;
                    const revealClass = showAnswer && (isCorrect ? " correct" : selected ? " incorrect" : "");
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`option-button ${selected ? "picked" : ""}${revealClass}`}
                        onClick={() => {
                          setSelectedAnswer(option.id);
                          setShowAnswer(true);
                        }}
                      >
                        <span className="radio-dot" />
                        <strong>{option.id}.</strong>
                        {option.text}
                      </button>
                    );
                  })}
                </div>
              )}

              {!(currentQuestion.type === "single" || currentQuestion.type === "true_false") && (
                <label className="answer-input">
                  <span>你的答案</span>
                  <textarea
                    value={textAnswer}
                    onChange={(event) => setTextAnswer(event.target.value)}
                    placeholder={currentQuestion.type === "sql" ? "在这里写 SQL，完成后可显示参考答案" : "写下关键词或作答要点"}
                    rows={currentQuestion.type === "sql" || currentQuestion.type === "short" ? 8 : 4}
                  />
                  {textAnswer && (
                    <small className={answerIsCorrect ? "inline-check ok" : "inline-check"}>
                      {answerIsCorrect ? "与标准答案匹配" : "可显示答案后自行核对"}
                    </small>
                  )}
                </label>
              )}

              <div className="question-footer">
                <div className="tag-list">
                  {currentQuestion.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="footer-actions">
                  <button className="ghost-button" type="button" onClick={() => setShowAnswer(true)}>
                    <Eye size={17} />
                    显示答案
                  </button>
                  <button
                    className="ghost-button danger"
                    type="button"
                    onClick={() => updateProgress(currentQuestion.id, { status: "wrong" })}
                  >
                    <XCircle size={17} />
                    标记错题
                  </button>
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => {
                      updateProgress(currentQuestion.id, { status: "known" });
                      nextQuestion();
                    }}
                  >
                    已掌握
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="empty-state">
              <h2>没有匹配的题目</h2>
              <p>调整筛选条件或清空搜索词后继续复习。</p>
              <button className="primary-button" type="button" onClick={resetFilters}>清空筛选</button>
            </div>
          )}
        </section>

        <aside className="right-rail" aria-label="答案与导航">
          <section className="answer-map">
            <div className="panel-heading">
              <h2>答题卡</h2>
              <span>共 {filteredQuestions.length} 题</span>
            </div>
            <div className="jump-grid">
              {filteredQuestions.map((question, index) => (
                <button
                  key={question.id}
                  type="button"
                  className={currentStatusClass(question.id)}
                  onClick={() => goToQuestion(index)}
                  aria-label={`跳转到第 ${index + 1} 题`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="legend">
              <span><i className="known" />正确</span>
              <span><i className="wrong" />错题</span>
              <span><i className="unseen" />未做</span>
              <span><i className="active" />当前</span>
            </div>
          </section>

          <section className="answer-panel">
            <div className="panel-heading">
              <h2>解析与知识点</h2>
              {currentQuestion && <span>{currentQuestion.points ? `${currentQuestion.points} 分` : "复习题"}</span>}
            </div>
            {currentQuestion && showAnswer ? (
              <div className="answer-content">
                <span className="knowledge">知识点：{currentQuestion.tags.slice(0, 2).join(" / ")}</span>
                <h3>参考答案</h3>
                <pre>{currentQuestion.modelAnswer}</pre>
                <h3>解析</h3>
                <p>{currentQuestion.explanation}</p>
                <div className="self-check">
                  <button
                    className="ghost-button danger"
                    type="button"
                    onClick={() => updateProgress(currentQuestion.id, { status: "wrong" })}
                  >
                    <XCircle size={17} />
                    还需复习
                  </button>
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => updateProgress(currentQuestion.id, { status: "known" })}
                  >
                    <CheckCircle2 size={17} />
                    已掌握
                  </button>
                </div>
              </div>
            ) : (
              <div className="answer-placeholder">
                <Eye size={28} />
                <p>先完成作答，再显示参考答案与解析。</p>
              </div>
            )}
          </section>
        </aside>
      </main>
    </div>
  );
}

export default App;
