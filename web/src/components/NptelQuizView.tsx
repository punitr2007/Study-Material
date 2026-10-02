import React, { useState, useMemo, useEffect } from 'react';
import type { QuizDatabase, QuizMode } from '../types/quiz';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  BookOpen, 
  Check, 
  Download, 
  Eye, 
  Sparkles, 
  Search, 
  Zap, 
  Clock, 
  BarChart2, 
  CheckSquare, 
  Square, 
  GraduationCap,
  Layers
} from 'lucide-react';
import quizDataJson from '../data/nptel_quizzes.json';

const quizData = quizDataJson as QuizDatabase;

interface NptelQuizViewProps {
  onPreviewPdf?: (url: string, title: string) => void;
}

export const NptelQuizView: React.FC<NptelQuizViewProps> = ({ onPreviewPdf }) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(4); // Default to Week 4
  const [mode, setMode] = useState<QuizMode>('practice');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number[]>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [autoCheck, setAutoCheck] = useState<boolean>(false); // default false: require clicking "Check Answer" so practice isn't spoiled
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Timer for exam mode
  useEffect(() => {
    let timer: any;
    if (mode === 'exam' && !isExamSubmitted) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, isExamSubmitted]);

  // Filter questions by week
  const weekQuestions = useMemo(() => {
    let list = selectedWeek === 0 
      ? quizData.questions 
      : quizData.questions.filter(q => q.week === selectedWeek);
      
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        item.scenario.toLowerCase().includes(q) ||
        item.prompt.toLowerCase().includes(q) ||
        item.lectureRef.toLowerCase().includes(q) ||
        item.options.some(opt => opt.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedWeek, searchQuery]);

  // Reset index when changing weeks or searches
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedWeek, searchQuery]);

  const currentQ = weekQuestions[currentIndex];
  const activeWeekMeta = quizData.weeks.find(w => w.week === selectedWeek);

  // Toggle option selection
  const handleSelectOption = (qId: string, optIdx: number, isMulti: boolean) => {
    if (mode === 'exam' && isExamSubmitted) return;

    // If question was already checked in manual practice mode, reset the check state so user can choose again without spoilers
    if (mode === 'practice' && !autoCheck && checkedQuestions[qId]) {
      setCheckedQuestions(prev => ({ ...prev, [qId]: false }));
    }

    setUserAnswers(prev => {
      const currentSelected = prev[qId] || [];
      if (isMulti) {
        if (currentSelected.includes(optIdx)) {
          return { ...prev, [qId]: currentSelected.filter(i => i !== optIdx) };
        } else {
          return { ...prev, [qId]: [...currentSelected, optIdx] };
        }
      } else {
        return { ...prev, [qId]: [optIdx] };
      }
    });
  };

  // Toggle Flag
  const toggleFlag = (qId: string) => {
    setFlaggedQuestions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Reset Quiz
  const handleReset = () => {
    setUserAnswers({});
    setCheckedQuestions({});
    setFlaggedQuestions({});
    setIsExamSubmitted(false);
    setCurrentIndex(0);
    setTimeElapsed(0);
  };

  // Submit Exam
  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
  };

  // Calculate scores
  const scoreResults = useMemo(() => {
    let correctCount = 0;
    let partialCount = 0;
    let attemptedCount = 0;

    weekQuestions.forEach(q => {
      const ans = userAnswers[q.id] || [];
      if (ans.length > 0) attemptedCount++;

      const correctSet = new Set(q.correctAnswers);

      if (ans.length > 0) {
        const isExactMatch = ans.length === q.correctAnswers.length && ans.every(i => correctSet.has(i));
        if (isExactMatch) {
          correctCount++;
        } else {
          const hasAnyCorrect = ans.some(i => correctSet.has(i));
          const hasAnyWrong = ans.some(i => !correctSet.has(i));
          if (hasAnyCorrect && !hasAnyWrong) {
            partialCount++;
          }
        }
      }
    });

    const total = weekQuestions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return {
      correctCount,
      partialCount,
      attemptedCount,
      total,
      percentage,
      unattempted: total - attemptedCount
    };
  }, [weekQuestions, userAnswers]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="nptel-quiz-container">
      {/* Course Banner */}
      <div className="nptel-quiz-header-card">
        <div className="nptel-header-left">
          <div className="nptel-course-badge">
            <GraduationCap size={16} />
            <span>NPTEL 109104107 • IIT Kanpur</span>
          </div>
          <h1 className="nptel-course-title">Developing Soft Skills and Personality</h1>
          <p className="nptel-instructor">Instructor: Prof. T. Ravichandran • Interactive Practice Test Engine</p>
        </div>

        <div className="nptel-header-actions">
          {activeWeekMeta?.pdfUrl && (
            <button 
              onClick={() => onPreviewPdf ? onPreviewPdf(activeWeekMeta.pdfUrl!, `Week ${activeWeekMeta.week} Assignment Questions`) : window.open(activeWeekMeta.pdfUrl, '_blank')}
              className="btn-download-pdf-nptel"
              title="View & Download authentic Assignment PDF"
            >
              <Download size={15} />
              <span>Assignment PDF</span>
            </button>
          )}
          <button 
            className="btn-reset-quiz" 
            onClick={handleReset}
            title="Reset answers and retake"
          >
            <RotateCcw size={15} />
            <span>Reset Test</span>
          </button>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="nptel-week-selector-bar">
        <button 
          className={`nptel-week-btn ${selectedWeek === 0 ? 'active' : ''}`}
          onClick={() => { setSelectedWeek(0); handleReset(); }}
        >
          <Layers size={14} />
          <span>All Weeks Mega Test ({quizData.totalQuestions})</span>
        </button>

        {quizData.weeks.map(w => (
          <button
            key={w.week}
            className={`nptel-week-btn ${selectedWeek === w.week ? 'active' : ''}`}
            onClick={() => { setSelectedWeek(w.week); handleReset(); }}
          >
            <span className="week-num-pill">W{w.week}</span>
            <span className="week-title-short">{w.title.split('&')[0].trim()}</span>
            <span className="week-q-count">({w.questionCount} Qs)</span>
          </button>
        ))}
      </div>

      {/* Week Overview Card */}
      {activeWeekMeta && selectedWeek !== 0 && (
        <div className="nptel-week-info-strip">
          <div className="week-info-left">
            <span className="week-badge-pill">Week {activeWeekMeta.week} Curriculum</span>
            <span className="week-lectures-pill">{activeWeekMeta.lectures}</span>
            <span className="week-desc-text">{activeWeekMeta.description}</span>
          </div>
          <div className="week-topics-tags">
            {activeWeekMeta.topics.map((t, idx) => (
              <span key={idx} className="topic-micro-tag">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Mode Switcher & Filter Bar */}
      <div className="nptel-controls-toolbar">
        <div className="mode-toggle-group">
          <button 
            className={`mode-btn ${mode === 'practice' ? 'active' : ''}`}
            onClick={() => setMode('practice')}
            title="Practice Mode: Test options and check feedback on demand"
          >
            <Zap size={15} />
            <span>Practice Mode</span>
          </button>
          <button 
            className={`mode-btn ${mode === 'exam' ? 'active' : ''}`}
            onClick={() => setMode('exam')}
            title="Exam Mode: Timed test with final scorecard"
          >
            <Clock size={15} />
            <span>Exam Mode {mode === 'exam' && `(${formatTime(timeElapsed)})`}</span>
          </button>
        </div>

        {/* Practice Mode Checking Preference Toggle */}
        {mode === 'practice' && (
          <button
            className={`toggle-reveal-mode-btn ${autoCheck ? 'auto' : 'manual'}`}
            onClick={() => setAutoCheck(prev => !prev)}
            title={autoCheck ? "Currently in Instant Reveal. Click to require 'Check Answer' button." : "Currently requiring 'Check Answer' button. Click to toggle Instant Reveal."}
          >
            <span className={`reveal-indicator-dot ${autoCheck ? 'auto' : 'manual'}`} />
            <span>{autoCheck ? '⚡ Instant Reveal: ON' : '🎯 Check Answers Mode: ON'}</span>
          </button>
        )}

        <div className="search-filter-box">
          <Search size={14} className="search-icon" />
          <input 
            type="text"
            placeholder="Search keywords, scenarios, lectures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-quiz-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>
      </div>

      {/* Main Quiz Body */}
      {weekQuestions.length === 0 ? (
        <div className="no-questions-state">
          <HelpCircle size={40} />
          <h3>No matching questions found</h3>
          <p>Try clearing your search query or selecting another week.</p>
        </div>
      ) : isExamSubmitted && mode === 'exam' ? (
        /* Scorecard View */
        <div className="exam-result-card">
          <div className="result-header">
            <div className="result-badge-icon">
              <Award size={36} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h2>Exam Performance Summary</h2>
            <p className="result-subtitle">NPTEL Developing Soft Skills and Personality • {activeWeekMeta ? `Week ${activeWeekMeta.week}` : 'All Weeks'}</p>
          </div>

          <div className="result-stats-grid">
            <div className="stat-box primary">
              <span className="stat-number">{scoreResults.percentage}%</span>
              <span className="stat-label">Overall Accuracy</span>
            </div>
            <div className="stat-box success">
              <span className="stat-number">{scoreResults.correctCount} / {scoreResults.total}</span>
              <span className="stat-label">Fully Correct</span>
            </div>
            <div className="stat-box warning">
              <span className="stat-number">{scoreResults.total - scoreResults.correctCount}</span>
              <span className="stat-label">Incorrect / Review Needed</span>
            </div>
            <div className="stat-box info">
              <span className="stat-number">{formatTime(timeElapsed)}</span>
              <span className="stat-label">Time Taken</span>
            </div>
          </div>

          <div className="result-actions">
            <button className="btn-review-answers" onClick={() => setIsExamSubmitted(false)}>
              <Eye size={16} />
              <span>Review Detailed Explanations</span>
            </button>
            <button className="btn-retake-exam" onClick={handleReset}>
              <RotateCcw size={16} />
              <span>Retake Examination</span>
            </button>
          </div>
        </div>
      ) : (
        /* Question Card & Question Palette Layout */
        <div className="nptel-quiz-layout">
          {/* Active Question Box */}
          <div className="nptel-question-main">
            <div className="question-header-row">
              <div className="question-num-tag">
                <span>Question {currentIndex + 1} of {weekQuestions.length}</span>
                {currentQ?.isMultiple ? (
                  <span className="multi-select-pill">Multiple Correct Options</span>
                ) : (
                  <span className="single-select-pill">Single Choice</span>
                )}
                {currentQ?.lectureRef && (
                  <span className="lecture-pill">{currentQ.lectureRef}</span>
                )}
              </div>

              <button 
                className={`btn-flag-q ${flaggedQuestions[currentQ?.id] ? 'flagged' : ''}`}
                onClick={() => currentQ && toggleFlag(currentQ.id)}
                title="Flag for later review"
              >
                <Flag size={15} />
                <span>{flaggedQuestions[currentQ?.id] ? 'Flagged' : 'Flag'}</span>
              </button>
            </div>

            {/* Scenario / Case Study Text */}
            {currentQ?.scenario && (
              <div className="scenario-card">
                <div className="scenario-header">
                  <BookOpen size={14} />
                  <span>Case Study / Situation Scenario</span>
                </div>
                <p className="scenario-text">{currentQ.scenario}</p>
              </div>
            )}

            {/* Question Prompt */}
            <h3 className="question-prompt-text">{currentQ?.prompt}</h3>

            {/* Options List */}
            <div className="options-container">
              {(() => {
                const isCurrentChecked = mode === 'practice'
                  ? (autoCheck ? ((userAnswers[currentQ?.id] || []).length > 0) : !!checkedQuestions[currentQ?.id])
                  : isExamSubmitted;

                return currentQ?.options.map((opt, optIdx) => {
                  const isSelected = (userAnswers[currentQ.id] || []).includes(optIdx);
                  const isCorrect = currentQ.correctAnswers.includes(optIdx);
                  
                  let optionClass = 'quiz-option-card';
                  if (isSelected) optionClass += ' selected';

                  if (isCurrentChecked) {
                    if (isSelected && isCorrect) {
                      optionClass += ' is-correct';
                    } else if (isSelected && !isCorrect) {
                      optionClass += ' is-wrong';
                    } else if (!isSelected && isCorrect) {
                      optionClass += ' missed-correct';
                    }
                  }

                  return (
                    <div 
                      key={optIdx} 
                      className={optionClass}
                      onClick={() => handleSelectOption(currentQ.id, optIdx, currentQ.isMultiple)}
                    >
                      <div className="option-indicator">
                        {currentQ.isMultiple ? (
                          isSelected ? <CheckSquare size={18} /> : <Square size={18} />
                        ) : (
                          <div className={`radio-circle ${isSelected ? 'checked' : ''}`} />
                        )}
                      </div>
                      <div className="option-text">{opt}</div>
                      {isCurrentChecked && isSelected && isCorrect && (
                        <div className="feedback-icon correct" title="Correct selection"><CheckCircle2 size={18} /></div>
                      )}
                      {isCurrentChecked && isSelected && !isCorrect && (
                        <div className="feedback-icon wrong" title="Incorrect selection"><XCircle size={18} /></div>
                      )}
                      {isCurrentChecked && !isSelected && isCorrect && (
                        <span className="missed-correct-badge">Correct Answer</span>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Check Answer Action Row in Practice Mode */}
            {mode === 'practice' && !autoCheck && (
              <div className="check-answer-control-row">
                {!checkedQuestions[currentQ.id] ? (
                  <button 
                    className="btn-check-answer"
                    disabled={!(userAnswers[currentQ.id]?.length > 0)}
                    onClick={() => setCheckedQuestions(prev => ({ ...prev, [currentQ.id]: true }))}
                  >
                    <Check size={16} />
                    <span>Check Answer</span>
                  </button>
                ) : (
                  <div className="checked-verdict-container">
                    {(() => {
                      const userSel = userAnswers[currentQ.id] || [];
                      const correctAns = currentQ.correctAnswers;
                      const isExact = userSel.length === correctAns.length && userSel.every(i => correctAns.includes(i));
                      const hasAnyCorrect = userSel.some(i => correctAns.includes(i));
                      const hasWrong = userSel.some(i => !correctAns.includes(i));

                      let verdictClass = 'wrong';
                      let verdictText = '❌ Incorrect. Review the lecture concept below.';
                      if (isExact) {
                        verdictClass = 'correct';
                        verdictText = '🎉 Completely Correct! Great job.';
                      } else if (hasAnyCorrect && !hasWrong) {
                        verdictClass = 'partial';
                        verdictText = `⚠️ Partially Correct (${userSel.length} of ${correctAns.length} selected).`;
                      } else if (hasAnyCorrect && hasWrong) {
                        verdictClass = 'partial';
                        verdictText = '⚠️ Partially Correct with some incorrect options chosen.';
                      }

                      return (
                        <div className="verdict-banner-wrap">
                          <div className={`verdict-pill ${verdictClass}`}>
                            {verdictText}
                          </div>
                          <button 
                            className="btn-try-again"
                            onClick={() => {
                              setCheckedQuestions(prev => ({ ...prev, [currentQ.id]: false }));
                              setUserAnswers(prev => ({ ...prev, [currentQ.id]: [] }));
                            }}
                            title="Clear answer and try again"
                          >
                            <RotateCcw size={14} />
                            <span>Try Again</span>
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Explanation Section */}
            {((mode === 'practice' && (autoCheck ? ((userAnswers[currentQ.id] || []).length > 0) : checkedQuestions[currentQ.id])) || isExamSubmitted) && currentQ?.explanation && (
              <div className="explanation-card">
                <div className="explanation-header">
                  <Sparkles size={16} />
                  <span>Lecture Analysis & Core Concept</span>
                </div>
                <p className="explanation-body">{currentQ.explanation}</p>
                {currentQ.lectureRef && (
                  <div className="explanation-reference">
                    <span>Reference: <strong>{currentQ.lectureRef}</strong> • NPTEL 109104107</span>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Bottom Row */}
            <div className="question-nav-bottom">
              <button 
                className="btn-nav-prev"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="question-progress-indicator">
                <span>{Object.keys(userAnswers).length} of {weekQuestions.length} Answered</span>
              </div>

              {currentIndex < weekQuestions.length - 1 ? (
                <button 
                  className="btn-nav-next"
                  onClick={() => setCurrentIndex(prev => Math.min(weekQuestions.length - 1, prev + 1))}
                >
                  <span>Next Question</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button 
                  className="btn-nav-submit"
                  onClick={handleSubmitExam}
                >
                  <Check size={16} />
                  <span>Submit Test</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="nptel-palette-sidebar">
            <div className="palette-header">
              <BarChart2 size={16} />
              <span>Question Palette</span>
            </div>

            <div className="palette-grid">
              {weekQuestions.map((q, idx) => {
                const isAnswered = (userAnswers[q.id] || []).length > 0;
                const isFlagged = flaggedQuestions[q.id];
                const isCurrent = idx === currentIndex;

                let pillClass = 'palette-pill';
                if (isCurrent) pillClass += ' current';
                if (isAnswered) pillClass += ' answered';
                if (isFlagged) pillClass += ' flagged';

                return (
                  <button 
                    key={q.id}
                    className={pillClass}
                    onClick={() => setCurrentIndex(idx)}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="palette-legend">
              <div className="legend-item"><span className="legend-dot current" /> Current</div>
              <div className="legend-item"><span className="legend-dot answered" /> Answered</div>
              <div className="legend-item"><span className="legend-dot flagged" /> Flagged</div>
              <div className="legend-item"><span className="legend-dot unanswered" /> Unanswered</div>
            </div>

            {mode === 'exam' && (
              <div className="exam-submit-box">
                <button 
                  className="btn-sidebar-submit"
                  onClick={handleSubmitExam}
                >
                  <Award size={16} />
                  <span>Complete & Submit Test</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
