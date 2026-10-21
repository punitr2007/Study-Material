import React, { useState, useMemo, useEffect } from 'react';
import type { QuizDatabase, QuizMode, QuizQuestion } from '../types/quiz';
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
  Layers,
  CheckCheck
} from 'lucide-react';
import assignmentDataJson from '../data/nptel_quizzes.json';
import masterBank200Json from '../data/nptel_master_bank_200.json';
import scenarioBank100Json from '../data/nptel_scenario_bank_100.json';
import allPractice300Json from '../data/nptel_question_bank.json';
import { useAuth } from '../context/AuthContext';
import { NptelLectureSummariesView } from './NptelLectureSummariesView';
import { LectureSummaryModal } from './LectureSummaryModal';

const assignmentData = assignmentDataJson as QuizDatabase;
const masterBank200Data = masterBank200Json as QuizDatabase;
const scenarioBank100Data = scenarioBank100Json as QuizDatabase;
const allPractice300Data = allPractice300Json as QuizDatabase;

export type QuizSourceType = 'master_bank_200' | 'scenario_bank_100' | 'all_practice_300' | 'assignments' | 'question_bank';
export type QuestionTypeFilter = 'ALL' | 'MSQ' | 'MCQ' | 'True/False';

interface NptelQuizViewProps {
  onPreviewPdf?: (url: string, title: string) => void;
  initialSource?: QuizSourceType;
}

export const NptelQuizView: React.FC<NptelQuizViewProps> = ({ 
  onPreviewPdf,
  initialSource = 'question_bank'
}) => {
  const { progress, saveQuizScore, toggleFlagQuestion } = useAuth();

  const [activeSource, setActiveSource] = useState<QuizSourceType>(initialSource);
  const [selectedType, setSelectedType] = useState<QuestionTypeFilter>('ALL');
  const [selectedWeek, setSelectedWeek] = useState<number>(1); // Default to Week 1
  const [mode, setMode] = useState<QuizMode>('practice');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number[]>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [autoCheck, setAutoCheck] = useState<boolean>(false); // default false: require clicking "Check Answer"
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [subView, setSubView] = useState<'quizzes' | 'summaries'>('quizzes');
  const [summaryModalLecture, setSummaryModalLecture] = useState<string | null>(null);
  const [summaryActiveLecture, setSummaryActiveLecture] = useState<number>(1);

  // Active dataset
  const activeDataset: QuizDatabase = useMemo(() => {
    switch (activeSource) {
      case 'master_bank_200':
      case 'question_bank':
        return masterBank200Data;
      case 'scenario_bank_100':
        return scenarioBank100Data;
      case 'all_practice_300':
        return allPractice300Data;
      case 'assignments':
      default:
        return assignmentData;
    }
  }, [activeSource]);

  // Normalize questions with explicit questionType
  const normalizedQuestions: QuizQuestion[] = useMemo(() => {
    return activeDataset.questions.map((q) => {
      let qType: 'MSQ' | 'MCQ' | 'True/False' = q.questionType || (q.isMultiple ? 'MSQ' : 'MCQ');
      if (!q.questionType) {
        if (q.options.length === 2 && (q.options[0].toLowerCase() === 'true' || q.options[0].toLowerCase() === 'false')) {
          qType = 'True/False';
        }
      }
      return {
        ...q,
        questionType: qType,
        isMultiple: qType === 'MSQ'
      };
    });
  }, [activeDataset]);

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

  // Questions for current week (before type filtering, for accurate count pills)
  const currentWeekAllQuestions = useMemo(() => {
    return selectedWeek === 0 
      ? normalizedQuestions 
      : normalizedQuestions.filter(q => q.week === selectedWeek);
  }, [normalizedQuestions, selectedWeek]);

  // Type counts for the selected week
  const typeCounts = useMemo(() => {
    return {
      all: currentWeekAllQuestions.length,
      msq: currentWeekAllQuestions.filter(q => q.questionType === 'MSQ').length,
      mcq: currentWeekAllQuestions.filter(q => q.questionType === 'MCQ').length,
      tf: currentWeekAllQuestions.filter(q => q.questionType === 'True/False').length,
    };
  }, [currentWeekAllQuestions]);

  // Filtered questions by week, type, and search query
  const filteredQuestions = useMemo(() => {
    let list = currentWeekAllQuestions;

    if (selectedType !== 'ALL') {
      list = list.filter(q => q.questionType === selectedType);
    }
      
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        item.scenario.toLowerCase().includes(q) ||
        item.prompt.toLowerCase().includes(q) ||
        item.lectureRef.toLowerCase().includes(q) ||
        (item.conceptualJustification && item.conceptualJustification.toLowerCase().includes(q)) ||
        item.options.some(opt => opt.toLowerCase().includes(q))
      );
    }
    return list;
  }, [currentWeekAllQuestions, selectedType, searchQuery]);

  // Reset index when changing source, weeks, type, or search
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeSource, selectedWeek, selectedType, searchQuery]);

  const currentQ = filteredQuestions[currentIndex];
  const activeWeekMeta = activeDataset.weeks.find(w => w.week === selectedWeek);

  // Toggle option selection
  const handleSelectOption = (qId: string, optIdx: number, isMulti: boolean) => {
    if (mode === 'exam' && isExamSubmitted) return;

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
    toggleFlagQuestion(qId);
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

  // Handle Switch Source
  const handleSwitchSource = (source: QuizSourceType) => {
    if (source === activeSource) return;
    setActiveSource(source);
    handleReset();
    setSelectedType('ALL');
  };

  // Calculate scores
  const scoreResults = useMemo(() => {
    let correctCount = 0;
    let partialCount = 0;
    let attemptedCount = 0;

    filteredQuestions.forEach(q => {
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

    const total = filteredQuestions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return {
      correctCount,
      partialCount,
      attemptedCount,
      total,
      percentage,
      unattempted: total - attemptedCount
    };
  }, [filteredQuestions, userAnswers]);

  // Submit Exam
  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
    const wrongIds: string[] = [];
    filteredQuestions.forEach(q => {
      const ans = userAnswers[q.id] || [];
      const correctSet = new Set(q.correctAnswers);
      const isExactMatch = ans.length === q.correctAnswers.length && ans.every(i => correctSet.has(i));
      if (!isExactMatch) {
        wrongIds.push(q.id);
      }
    });

    if (selectedWeek > 0 && activeSource === 'assignments') {
      saveQuizScore(selectedWeek, scoreResults.correctCount, scoreResults.total, wrongIds);
    }
  };

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
          <p className="nptel-instructor">
            Instructor: Prof. T. Ravichandran • Practice Vault & Question Bank Engine
          </p>
        </div>

        <div className="nptel-header-actions">
          {activeWeekMeta?.pdfUrl && activeSource === 'assignments' && (
            <button 
              onClick={() => onPreviewPdf ? onPreviewPdf(activeWeekMeta.pdfUrl!, `Week ${activeWeekMeta.week} Assignment Questions`) : window.open(activeWeekMeta.pdfUrl, '_blank')}
              className="btn-download-pdf-nptel"
              title="View & Download authentic Assignment PDF"
            >
              <Download size={15} />
              <span>Assignment PDF</span>
            </button>
          )}

          <a 
            href={
              activeSource === 'scenario_bank_100'
                ? "/NPTEL-Master-Scenario-Question-Bank-100-Questions.md"
                : "/NPTEL-Master-Practice-Bank-200-Questions.md"
            }
            download={
              activeSource === 'scenario_bank_100'
                ? "NPTEL-Master-Scenario-Question-Bank-100-Questions.md"
                : "NPTEL-Master-Practice-Bank-200-Questions.md"
            }
            className="btn-download-pdf-nptel"
            title="Download Practice Question Bank Markdown file"
            style={{ textDecoration: 'none' }}
          >
            <Download size={15} />
            <span>Bank .MD</span>
          </a>

          <button 
            className="btn-download-pdf-nptel"
            onClick={() => setSubView(subView === 'summaries' ? 'quizzes' : 'summaries')}
            style={{
              background: subView === 'summaries' ? 'var(--accent-primary)' : undefined,
              color: subView === 'summaries' ? '#ffffff' : undefined,
              borderColor: subView === 'summaries' ? 'var(--accent-primary)' : undefined,
            }}
            title="Toggle between Quizzes and 48 Lecture Summaries"
          >
            <BookOpen size={15} />
            <span>{subView === 'summaries' ? 'Practice Questions' : '48 Lecture Notes'}</span>
          </button>
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

      {subView === 'summaries' ? (
        <NptelLectureSummariesView
          initialLectureNumber={summaryActiveLecture}
          initialWeek={selectedWeek === 0 ? 1 : selectedWeek}
          onSwitchToQuiz={() => setSubView('quizzes')}
        />
      ) : (
        <>
          {/* Question Bank vs Assignment Quizzes Source Switcher */}
          <div className="nptel-source-tabs-bar">
            <button
              onClick={() => handleSwitchSource('master_bank_200')}
              className={`source-tab-btn ${activeSource === 'master_bank_200' || activeSource === 'question_bank' ? 'active' : ''}`}
            >
              <Sparkles size={16} />
              <span>200 Master Practice Bank</span>
              <span className="source-count-badge">200 Qs • MSQ / MCQ / TF</span>
            </button>
            <button
              onClick={() => handleSwitchSource('scenario_bank_100')}
              className={`source-tab-btn ${activeSource === 'scenario_bank_100' ? 'active' : ''}`}
            >
              <Award size={16} />
              <span>100 Scenario Bank</span>
              <span className="source-count-badge">100 Qs • Case Studies</span>
            </button>
            <button
              onClick={() => handleSwitchSource('all_practice_300')}
              className={`source-tab-btn ${activeSource === 'all_practice_300' ? 'active' : ''}`}
            >
              <Layers size={16} />
              <span>All Practice (300 Qs)</span>
              <span className="source-count-badge">300 Qs Mega Set</span>
            </button>
            <button
              onClick={() => handleSwitchSource('assignments')}
              className={`source-tab-btn ${activeSource === 'assignments' ? 'active' : ''}`}
            >
              <BookOpen size={16} />
              <span>Official Assignments</span>
              <span className="source-count-badge">200 Qs • 8 Weeks</span>
            </button>
          </div>

          {/* Week Selector Tabs */}
          <div className="nptel-week-selector-bar">
            <button 
              className={`nptel-week-btn ${selectedWeek === 0 ? 'active' : ''}`}
              onClick={() => { setSelectedWeek(0); handleReset(); }}
            >
              <Layers size={14} />
              <span>All Weeks Mega Set ({activeDataset.totalQuestions})</span>
            </button>

            {activeDataset.weeks.map(w => {
              const attempt = activeSource === 'assignments' ? progress.nptelProgress?.[`week_${w.week}`] : undefined;
              return (
                <button
                  key={w.week}
                  className={`nptel-week-btn ${selectedWeek === w.week ? 'active' : ''}`}
                  onClick={() => { setSelectedWeek(w.week); handleReset(); }}
                >
                  <span className="week-num-pill">W{w.week}</span>
                  <span className="week-title-short">{w.title.split('&')[0].split(',')[0].trim()}</span>
                  <span className="week-q-count">({w.questionCount} Qs)</span>
                  {attempt && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: attempt.percentage >= 70 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: attempt.percentage >= 70 ? '#10b981' : '#f59e0b',
                        fontWeight: 700,
                        marginLeft: '2px'
                      }}
                      title={`Best score: ${attempt.highestScore}/${attempt.totalQuestions} (${attempt.percentage}%)`}
                    >
                      {attempt.highestScore}/{attempt.totalQuestions}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Question Type Filter Bar */}
          <div className="question-type-filter-bar">
            <span className="type-filter-label">Filter Type:</span>
            <button 
              className={`type-filter-btn ${selectedType === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedType('ALL')}
            >
              <span>All Types</span>
              <span className="type-filter-count">({typeCounts.all})</span>
            </button>
            <button 
              className={`type-filter-btn ${selectedType === 'MSQ' ? 'active' : ''}`}
              onClick={() => setSelectedType('MSQ')}
            >
              <CheckSquare size={13} />
              <span>MSQ (Multiple Select)</span>
              <span className="type-filter-count">({typeCounts.msq})</span>
            </button>
            <button 
              className={`type-filter-btn ${selectedType === 'MCQ' ? 'active' : ''}`}
              onClick={() => setSelectedType('MCQ')}
            >
              <CheckCircle2 size={13} />
              <span>MCQ (Single Choice)</span>
              <span className="type-filter-count">({typeCounts.mcq})</span>
            </button>
            <button 
              className={`type-filter-btn ${selectedType === 'True/False' ? 'active' : ''}`}
              onClick={() => setSelectedType('True/False')}
            >
              <HelpCircle size={13} />
              <span>True / False</span>
              <span className="type-filter-count">({typeCounts.tf})</span>
            </button>
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

          {/* Mode Switcher & Search Bar */}
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
                {autoCheck ? (
                  <>
                    <Zap size={13} style={{ color: '#f59e0b' }} />
                    <span>Instant Reveal Mode</span>
                  </>
                ) : (
                  <>
                    <CheckSquare size={13} style={{ color: '#10b981' }} />
                    <span>Manual Check Mode</span>
                  </>
                )}
              </button>
            )}

            <div className="search-filter-box">
              <Search size={14} className="search-icon" />
              <input 
                type="text"
                placeholder="Search scenarios, questions, concepts, thinkers..."
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
          {filteredQuestions.length === 0 ? (
            <div className="no-questions-state">
              <HelpCircle size={40} />
              <h3>No matching questions found</h3>
              <p>Try switching the question type filter or clearing your search query.</p>
            </div>
          ) : isExamSubmitted && mode === 'exam' ? (
            /* Scorecard View */
            <div className="exam-result-card">
              <div className="result-header">
                <div className="result-badge-icon">
                  <Award size={36} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <h2>Exam Performance Summary</h2>
                <p className="result-subtitle">
                  {activeSource === 'question_bank' ? 'Master Scenario Question Bank' : 'NPTEL Official Assignment Quizzes'} • {activeWeekMeta ? `Week ${activeWeekMeta.week}` : 'All Weeks'}
                </p>
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
                  <div className="question-num-tag" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span>Question {currentIndex + 1} of {filteredQuestions.length}</span>
                    
                    {/* Explicit Type Badge */}
                    {currentQ?.questionType === 'MSQ' ? (
                      <span className="qtype-indicator-badge msq">
                        <CheckSquare size={12} />
                        <span>MSQ: Multiple Select</span>
                      </span>
                    ) : currentQ?.questionType === 'True/False' ? (
                      <span className="qtype-indicator-badge truefalse">
                        <HelpCircle size={12} />
                        <span>True / False</span>
                      </span>
                    ) : (
                      <span className="qtype-indicator-badge mcq">
                        <CheckCircle2 size={12} />
                        <span>MCQ: Single Choice</span>
                      </span>
                    )}

                    {currentQ?.lectureRef && (
                      <button
                        type="button"
                        className="lecture-pill"
                        onClick={() => {
                          const m = currentQ.lectureRef.match(/(\d+)/);
                          if (m) setSummaryActiveLecture(parseInt(m[1]));
                          setSummaryModalLecture(currentQ.lectureRef);
                        }}
                        title={`Click to read lecture revision note for ${currentQ.lectureRef}`}
                        style={{
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          border: '1px solid rgba(99, 102, 241, 0.35)',
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: 'var(--accent-primary)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <BookOpen size={12} />
                        <span>{currentQ.lectureRef}</span>
                        <span style={{ fontSize: '0.68rem', opacity: 0.8, marginLeft: '2px' }}>Notes ↗</span>
                      </button>
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

                {/* MSQ Notice banner */}
                {currentQ?.questionType === 'MSQ' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.84rem',
                    color: 'var(--accent-primary)',
                    fontWeight: 600
                  }}>
                    <CheckCheck size={16} />
                    <span>Multiple Select Question: Select all statements that are correct. Partial credit awarded.</span>
                  </div>
                )}

                {/* Options List */}
                <div className="options-container">
                  {(() => {
                    const isCurrentChecked = mode === 'practice'
                      ? (autoCheck ? ((userAnswers[currentQ?.id] || []).length > 0) : !!checkedQuestions[currentQ?.id])
                      : isExamSubmitted;

                    // If True/False, render as distinctive large choices
                    if (currentQ?.questionType === 'True/False') {
                      return (
                        <div className="tf-choices-grid">
                          {currentQ.options.map((opt, optIdx) => {
                            const isSelected = (userAnswers[currentQ.id] || []).includes(optIdx);
                            const isCorrect = currentQ.correctAnswers.includes(optIdx);

                            let btnClass = 'tf-choice-btn';
                            if (isSelected) btnClass += ' selected';
                            if (isCurrentChecked) {
                              if (isSelected && isCorrect) btnClass += ' is-correct';
                              else if (isSelected && !isCorrect) btnClass += ' is-wrong';
                              else if (!isSelected && isCorrect) btnClass += ' missed-correct';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                className={btnClass}
                                onClick={() => handleSelectOption(currentQ.id, optIdx, false)}
                              >
                                {opt.toLowerCase() === 'true' ? (
                                  <CheckCircle2 size={20} style={{ color: isSelected ? 'inherit' : '#10b981' }} />
                                ) : (
                                  <XCircle size={20} style={{ color: isSelected ? 'inherit' : '#ef4444' }} />
                                )}
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    }

                    // Otherwise render MSQ or MCQ standard options cards
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
                            verdictText = `⚠️ Partially Correct (${userSel.length} of ${correctAns.length} correct options selected).`;
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

                {/* Detailed Explanation & Breakdown Section */}
                {((mode === 'practice' && (autoCheck ? ((userAnswers[currentQ.id] || []).length > 0) : checkedQuestions[currentQ.id])) || isExamSubmitted) && (
                  <div className="explanation-card">
                    <div className="explanation-header">
                      <Sparkles size={16} />
                      <span>Lecture Analysis & Deep Explanation</span>
                    </div>

                    {/* Conceptual Justification */}
                    {currentQ.conceptualJustification ? (
                      <div className="conceptual-justification-card">
                        <div className="conceptual-justification-title">
                          <BookOpen size={14} />
                          <span>Conceptual Justification</span>
                        </div>
                        <div className="conceptual-justification-text">
                          {currentQ.conceptualJustification}
                        </div>
                      </div>
                    ) : (
                      <p className="explanation-body">{currentQ.explanation}</p>
                    )}

                    {/* Option-by-Option Breakdown */}
                    {currentQ.optionBreakdown && currentQ.optionBreakdown.length > 0 && (
                      <div className="option-breakdown-section">
                        <div className="option-breakdown-title">
                          <CheckCheck size={14} />
                          <span>Option-by-Option Breakdown</span>
                        </div>
                        {currentQ.optionBreakdown.map((item, bIdx) => (
                          <div 
                            key={bIdx} 
                            className={`breakdown-row-item ${item.isCorrect ? 'correct' : 'incorrect'}`}
                          >
                            <div className="breakdown-option-name">
                              <span className={`breakdown-tag ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                                {item.isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                              <span>{item.option}</span>
                            </div>
                            <div className="breakdown-explanation-text">
                              {item.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentQ.lectureRef && (
                      <div className="explanation-reference" style={{ marginTop: '12px' }}>
                        <span>Reference: <strong>{currentQ.lectureRef}</strong> • NPTEL 109104107</span>
                      </div>
                    )}

                    {currentQ.disputeNotes && (
                      <div className="suggested-answer-card" style={{ marginTop: '12px', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.22)' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#fbbf24', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          💡 Suggested Alternative / Key Clarification
                        </div>
                        <div style={{ fontSize: '0.82rem', lineHeight: '1.45', color: 'var(--text-secondary)' }}>
                          {currentQ.disputeNotes}
                        </div>
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
                    <span>{Object.keys(userAnswers).length} of {filteredQuestions.length} Answered</span>
                  </div>

                  {currentIndex < filteredQuestions.length - 1 ? (
                    <button 
                      className="btn-nav-next"
                      onClick={() => setCurrentIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1))}
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
                  <span>Question Palette ({filteredQuestions.length})</span>
                </div>

                <div className="palette-grid">
                  {filteredQuestions.map((q, idx) => {
                    const isAnswered = (userAnswers[q.id] || []).length > 0;
                    const isFlagged = !!flaggedQuestions[q.id];
                    const isCurrent = idx === currentIndex;

                    let btnClass = 'palette-q-btn';
                    if (isCurrent) btnClass += ' active';
                    if (isAnswered) btnClass += ' answered';
                    if (isFlagged) btnClass += ' flagged';

                    return (
                      <button
                        key={q.id}
                        className={btnClass}
                        onClick={() => setCurrentIndex(idx)}
                        title={`Jump to Q${idx + 1} (${q.questionType}): ${isAnswered ? 'Answered' : 'Unanswered'}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="palette-legend">
                  <div className="legend-item"><span className="legend-dot current"></span> Current</div>
                  <div className="legend-item"><span className="legend-dot answered"></span> Answered</div>
                  <div className="legend-item"><span className="legend-dot flagged"></span> Flagged</div>
                  <div className="legend-item"><span className="legend-dot unvisited"></span> Unvisited</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Slide-over Lecture Summary Modal */}
      <LectureSummaryModal
        lectureIdentifier={summaryModalLecture || summaryActiveLecture}
        isOpen={Boolean(summaryModalLecture)}
        onClose={() => setSummaryModalLecture(null)}
        onOpenFullSummaries={(lecNum) => {
          setSummaryActiveLecture(lecNum);
          setSummaryModalLecture(null);
          setSubView('summaries');
        }}
      />
    </div>
  );
};
