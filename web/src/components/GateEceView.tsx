import React, { useState, useMemo, useEffect } from 'react';
import type {
  GateDatabase,
  GateCatalog,
  GateQuestion,
  GateFilterType,
  GateQuizMode
} from '../types/gate';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Flag,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Download,
  Eye,
  Sparkles,
  Search,
  Zap,
  Clock,
  GraduationCap,
  Layers,
  Grid,
  X,
  FileText,
  Binary,
  Radio,
  Cpu,
  Calculator,
  Sliders,
  Activity,
  Wifi,
  Compass
} from 'lucide-react';
import { KaTeXRenderer } from './KaTeXRenderer';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

interface GateEceViewProps {
  onPreviewPdf?: (url: string, title: string) => void;
  onNavigateHome?: () => void;
}

export const GateEceView: React.FC<GateEceViewProps> = ({ onPreviewPdf }) => {
  // Navigation tabs within GATE ECE
  const [activeTab, setActiveTab] = useState<'practice' | 'booklets' | 'handbooks' | 'syllabus'>('practice');

  // Master Data state
  const [catalog, setCatalog] = useState<GateCatalog | null>(null);
  const [bankData, setBankData] = useState<GateDatabase | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState<boolean>(true);
  const [loadingBank, setLoadingBank] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string>('ALL');
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<GateFilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mode, setMode] = useState<GateQuizMode>('practice');

  // Interactive Quiz State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userMcqSelections, setUserMcqSelections] = useState<Record<string, number>>({});
  const [userMsqSelections, setUserMsqSelections] = useState<Record<string, number[]>>({});
  const [userNatAnswers, setUserNatAnswers] = useState<Record<string, string>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [autoCheck, setAutoCheck] = useState<boolean>(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [paletteFilter, setPaletteFilter] = useState<'ALL' | 'ANSWERED' | 'UNANSWERED' | 'FLAGGED'>('ALL');
  const [manualShowSolution, setManualShowSolution] = useState<Record<string, boolean>>({});

  // 1. Load initial catalog manifest
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const res = await fetch('/gate_ece_catalog.json');
        if (!res.ok) throw new Error('Failed to load GATE catalog');
        const data: GateCatalog = await res.json();
        if (isMounted) {
          setCatalog(data);
          setLoadingCatalog(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error loading catalog');
          setLoadingCatalog(false);
        }
      }
    };
    fetchCatalog();
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch full question bank when entering practice tab
  useEffect(() => {
    if (activeTab === 'practice' && !bankData && !loadingBank) {
      let isMounted = true;
      setLoadingBank(true);
      fetch('/gate_ece_bank.json')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load GATE questions database');
          return res.json();
        })
        .then((data: GateDatabase) => {
          if (isMounted) {
            setBankData(data);
            setLoadingBank(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            console.error('Error loading GATE bank:', err);
            setLoadingBank(false);
          }
        });
      return () => { isMounted = false; };
    }
  }, [activeTab, bankData, loadingBank]);

  // Exam timer
  useEffect(() => {
    if (mode !== 'exam' || isExamSubmitted) return;
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, isExamSubmitted]);

  // Filtered Topics list based on selected subject
  const availableTopics = useMemo(() => {
    if (!catalog) return [];
    if (selectedSubjectSlug === 'ALL') {
      return catalog.subjects.flatMap((s) => s.topics);
    }
    const subj = catalog.subjects.find((s) => s.slug === selectedSubjectSlug);
    return subj ? subj.topics : [];
  }, [catalog, selectedSubjectSlug]);

  // Reset topic filter if selected topic doesn't belong to selected subject
  useEffect(() => {
    if (selectedTopicSlug !== 'ALL') {
      const match = availableTopics.find((t) => t.slug === selectedTopicSlug);
      if (!match) {
        setSelectedTopicSlug('ALL');
        setCurrentIndex(0);
      }
    }
  }, [availableTopics, selectedTopicSlug]);

  // Filtered Questions for Practice
  const filteredQuestions = useMemo(() => {
    if (!bankData) return [];
    return bankData.questions.filter((q) => {
      if (selectedSubjectSlug !== 'ALL' && q.subjectSlug !== selectedSubjectSlug) {
        return false;
      }
      if (selectedTopicSlug !== 'ALL' && q.topicSlug !== selectedTopicSlug) {
        return false;
      }
      if (selectedType !== 'ALL' && q.type !== selectedType) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchText = q.text.toLowerCase().includes(query);
        const matchTopic = q.topicTitle.toLowerCase().includes(query);
        const matchTag = q.tagYear.toLowerCase().includes(query);
        const matchSubj = q.subjectName.toLowerCase().includes(query);
        if (!matchText && !matchTopic && !matchTag && !matchSubj) return false;
      }
      return true;
    });
  }, [bankData, selectedSubjectSlug, selectedTopicSlug, selectedType, searchQuery]);

  // Clamp current index when filter changes
  useEffect(() => {
    if (currentIndex >= filteredQuestions.length && filteredQuestions.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredQuestions.length, currentIndex]);

  const currentQuestion: GateQuestion | null = useMemo(() => {
    if (filteredQuestions.length === 0) return null;
    return filteredQuestions[currentIndex] || filteredQuestions[0];
  }, [filteredQuestions, currentIndex]);

  // Answer state helpers for current question
  const isQuestionAnswered = (q: GateQuestion) => {
    if (q.type === 'MCQ') return userMcqSelections[q.id] !== undefined;
    if (q.type === 'MSQ') return (userMsqSelections[q.id] || []).length > 0;
    if (q.type === 'NAT') {
      const val = userNatAnswers[q.id];
      return val !== undefined && val.trim() !== '';
    }
    return false;
  };

  const isQuestionCorrect = (q: GateQuestion) => {
    if (q.type === 'MCQ') {
      const sel = userMcqSelections[q.id];
      return sel !== undefined && sel === q.correct;
    }
    if (q.type === 'MSQ') {
      const sels = (userMsqSelections[q.id] || []).slice().sort();
      const corrs = (q.correctAnswers || []).slice().sort();
      if (sels.length !== corrs.length) return false;
      return sels.every((v, i) => v === corrs[i]);
    }
    if (q.type === 'NAT') {
      const val = parseFloat(userNatAnswers[q.id] || '');
      if (isNaN(val)) return false;
      if (q.ansMin !== null && q.ansMax !== null) {
        return val >= q.ansMin && val <= q.ansMax;
      }
      return false;
    }
    return false;
  };

  // Performance calculations
  const stats = useMemo(() => {
    let answeredCount = 0;
    let correctCount = 0;
    let totalScore = 0;
    let maxScore = 0;

    filteredQuestions.forEach((q) => {
      maxScore += q.marks || 1;
      if (isQuestionAnswered(q)) {
        answeredCount++;
        if (isQuestionCorrect(q)) {
          correctCount++;
          totalScore += q.marks || 1;
        } else if (mode === 'exam' && q.type === 'MCQ') {
          // GATE negative marking: 1/3 for 1 mark, 2/3 for 2 marks (MCQ only)
          const penalty = (q.marks || 1) / 3;
          totalScore -= penalty;
        }
      }
    });

    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    return {
      answeredCount,
      correctCount,
      totalScore: Math.max(0, Math.round(totalScore * 100) / 100),
      maxScore,
      accuracy,
      total: filteredQuestions.length
    };
  }, [filteredQuestions, userMcqSelections, userMsqSelections, userNatAnswers, mode]);

  // Handlers
  const handleSelectMcq = (optIndex: number) => {
    if (!currentQuestion || isExamSubmitted) return;
    setUserMcqSelections((prev) => ({ ...prev, [currentQuestion.id]: optIndex }));
    if (autoCheck && mode === 'practice') {
      setCheckedQuestions((prev) => ({ ...prev, [currentQuestion.id]: true }));
    }
  };

  const handleToggleMsq = (optIndex: number) => {
    if (!currentQuestion || isExamSubmitted) return;
    setUserMsqSelections((prev) => {
      const cur = prev[currentQuestion.id] || [];
      const next = cur.includes(optIndex) ? cur.filter((i) => i !== optIndex) : [...cur, optIndex];
      return { ...prev, [currentQuestion.id]: next };
    });
  };

  const handleNatChange = (val: string) => {
    if (!currentQuestion || isExamSubmitted) return;
    setUserNatAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;
    setCheckedQuestions((prev) => ({ ...prev, [currentQuestion.id]: true }));
  };

  const handleToggleFlag = (qId: string) => {
    setFlaggedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleResetFilters = () => {
    setSelectedSubjectSlug('ALL');
    setSelectedTopicSlug('ALL');
    setSelectedType('ALL');
    setSearchQuery('');
    setCurrentIndex(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getSubjectIcon = (slug: string) => {
    if (slug.includes('math')) return <Calculator size={18} />;
    if (slug.includes('network')) return <Zap size={18} />;
    if (slug.includes('signal')) return <Activity size={18} />;
    if (slug.includes('device')) return <Cpu size={18} />;
    if (slug.includes('analog')) return <Sliders size={18} />;
    if (slug.includes('digital')) return <Binary size={18} />;
    if (slug.includes('control')) return <Compass size={18} />;
    if (slug.includes('comm')) return <Radio size={18} />;
    if (slug.includes('electro')) return <Wifi size={18} />;
    return <GraduationCap size={18} />;
  };

  if (loadingCatalog) {
    return (
      <div style={{ padding: '60px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div className="spinner" style={{ margin: '0 auto 16px auto', width: '36px', height: '36px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Loading GATE - ECE Curriculum...</h3>
        <p style={{ fontSize: '0.88rem' }}>Accessing 10 core subjects, 64 topics, and 2,028 solved PYQs</p>
      </div>
    );
  }

  if (error || !catalog) {
    return (
      <div style={{ padding: '48px 16px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <AlertCircle size={40} style={{ color: 'var(--accent-danger, #ef4444)', marginBottom: '12px' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Could Not Load GATE Material</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>{error || 'Unable to load catalog manifest.'}</p>
        <button onClick={() => window.location.reload()} className="btn-preview" style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="gate-ece-container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '16px 12px 64px 12px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 20px',
          marginBottom: '20px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'var(--bg-tertiary)',
                color: 'var(--accent-primary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '10px'
              }}
            >
              <GraduationCap size={15} />
              <span>GATE EC Official Academic Vault</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              GATE — Electronics & Communication Engineering
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '720px', lineHeight: 1.5 }}>
              Master all 10 core subjects with 2,028 previous year questions (1991–2026), step-by-step mathematical derivations, downloadable booklets, and high-density formula cheat sheets.
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '10px 16px', borderRadius: 'var(--radius-lg)', textAlign: 'center', minWidth: '85px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)' }}>{catalog.totalQuestions}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total PYQs</div>
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '10px 16px', borderRadius: 'var(--radius-lg)', textAlign: 'center', minWidth: '85px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)' }}>{catalog.totalSubjects}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Subjects</div>
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '10px 16px', borderRadius: 'var(--radius-lg)', textAlign: 'center', minWidth: '85px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)' }}>{catalog.totalTopics}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Topics</div>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '22px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
        >
          <button
            role="tab"
            aria-selected={activeTab === 'practice'}
            onClick={() => setActiveTab('practice')}
            className={`tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}
          >
            <Sparkles size={16} />
            <span>Interactive Quiz Solver</span>
            <span className="tab-badge" style={{ background: 'var(--bg-tertiary)' }}>{catalog.totalQuestions}</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'booklets'}
            onClick={() => setActiveTab('booklets')}
            className={`tab-btn ${activeTab === 'booklets' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}
          >
            <BookOpen size={16} />
            <span>Topic Booklets & Papers</span>
            <span className="tab-badge" style={{ background: 'var(--bg-tertiary)' }}>64</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'handbooks'}
            onClick={() => setActiveTab('handbooks')}
            className={`tab-btn ${activeTab === 'handbooks' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}
          >
            <FileText size={16} />
            <span>Formula Handbooks</span>
            <span className="tab-badge" style={{ background: 'var(--bg-tertiary)' }}>{catalog.handbooks?.length || 6}</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'syllabus'}
            onClick={() => setActiveTab('syllabus')}
            className={`tab-btn ${activeTab === 'syllabus' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}
          >
            <Layers size={16} />
            <span>Syllabus & Weightage</span>
          </button>
        </div>
      </div>

      {/* ==================== TAB 1: INTERACTIVE QUIZ SOLVER ==================== */}
      {activeTab === 'practice' && (
        <div>
          {loadingBank ? (
            <div style={{ padding: '60px 16px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
              <div className="spinner" style={{ margin: '0 auto 16px auto', width: '36px', height: '36px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>Loading 2,028 Practice Questions...</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Parsing formulas, circuit diagrams, and mathematical answer keys.</p>
            </div>
          ) : (
            <div>
              {/* Controls Bar: Subject, Topic, Type Filters */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '16px',
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Row 1: Subject Selector Pills */}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Select Subject
                  </div>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                    <button
                      onClick={() => { setSelectedSubjectSlug('ALL'); setCurrentIndex(0); }}
                      className={`tab-btn ${selectedSubjectSlug === 'ALL' ? 'active' : ''}`}
                      style={{ padding: '7px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Layers size={14} />
                      <span>All 10 Subjects</span>
                      <span className="tab-badge" style={{ fontSize: '0.72rem' }}>2028</span>
                    </button>
                    {catalog.subjects.map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => { setSelectedSubjectSlug(s.slug); setCurrentIndex(0); }}
                        className={`tab-btn ${selectedSubjectSlug === s.slug ? 'active' : ''}`}
                        style={{ padding: '7px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        {getSubjectIcon(s.slug)}
                        <span>{s.name}</span>
                        <span className="tab-badge" style={{ fontSize: '0.72rem' }}>{s.questionCount}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 2: Topic & Type Filters + Search */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Topic dropdown */}
                  <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
                    <select
                      value={selectedTopicSlug}
                      onChange={(e) => { setSelectedTopicSlug(e.target.value); setCurrentIndex(0); }}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem',
                        fontWeight: 600
                      }}
                    >
                      <option value="ALL">All Topics in {selectedSubjectSlug === 'ALL' ? 'Curriculum' : 'Subject'} ({availableTopics.length})</option>
                      {availableTopics.map((t) => (
                        <option key={t.slug} value={t.slug}>
                          {t.title} ({t.questionCount} Qs)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Question Type Filter Pills */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(['ALL', 'MCQ', 'MSQ', 'NAT'] as GateFilterType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setSelectedType(t); setCurrentIndex(0); }}
                        className={`tab-btn ${selectedType === t ? 'active' : ''}`}
                        style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', fontWeight: 700 }}
                      >
                        {t === 'ALL' ? 'All Types' : t}
                      </button>
                    ))}
                  </div>

                  {/* Practice vs Exam Mode Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => setMode('practice')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        background: mode === 'practice' ? 'var(--accent-primary)' : 'transparent',
                        color: mode === 'practice' ? '#ffffff' : 'var(--text-secondary)'
                      }}
                    >
                      Practice
                    </button>
                    <button
                      onClick={() => { setMode('exam'); setIsExamSubmitted(false); }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        background: mode === 'exam' ? 'var(--accent-primary)' : 'transparent',
                        color: mode === 'exam' ? '#ffffff' : 'var(--text-secondary)'
                      }}
                    >
                      Exam
                    </button>
                    {mode === 'practice' && (
                      <button
                        onClick={() => setAutoCheck(!autoCheck)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: autoCheck ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                          color: autoCheck ? '#10b981' : 'var(--text-muted)'
                        }}
                        title="Auto-reveal answers immediately on option selection"
                      >
                        Auto-Check: {autoCheck ? 'ON' : 'OFF'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Row 3: Quick Search Bar */}
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search questions by formula, theorem, component, or GATE year (e.g., 'Norton', '2025', 'Nyquist')..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentIndex(0); }}
                    style={{
                      width: '100%',
                      padding: '8px 36px 8px 36px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.86rem'
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Quiz Main Area */}
              {filteredQuestions.length === 0 ? (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '48px 16px', textAlign: 'center' }}>
                  <AlertCircle size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>No Questions Match Selected Filters</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>Try clearing the search query or selecting another subject or question type.</p>
                  <button onClick={handleResetFilters} className="btn-preview" style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', fontSize: '0.86rem' }}>
                    Reset Filters
                  </button>
                </div>
              ) : currentQuestion && (
                <div>
                  {/* Top Status & Progress Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '10px',
                      fontSize: '0.84rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                        Question {currentIndex + 1} of {filteredQuestions.length}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>•</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{currentQuestion.topicTitle}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {mode === 'exam' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                          <Clock size={15} />
                          <span>{formatTime(timeElapsed)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <span>Score: <strong style={{ color: 'var(--text-primary)' }}>{stats.totalScore}</strong> / {stats.maxScore}</span>
                        <span>•</span>
                        <span>Answered: <strong style={{ color: 'var(--text-primary)' }}>{stats.answeredCount}</strong> / {stats.total}</span>
                      </div>
                      <button
                        onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                        className="btn-preview"
                        style={{ padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Grid size={13} />
                        <span>Palette</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Card (NotebookLM Mobile Card Style) */}
                  <div
                    className="gate-quiz-card"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '24px 20px',
                      marginBottom: '16px'
                    }}
                  >
                    {/* Header Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {/* Year tag */}
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          {currentQuestion.tagYear}
                        </span>

                        {/* Question type badge */}
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            background:
                              currentQuestion.type === 'MCQ'
                                ? 'var(--bg-tertiary)'
                                : currentQuestion.type === 'MSQ'
                                ? 'rgba(2, 132, 199, 0.12)'
                                : 'rgba(245, 158, 11, 0.12)',
                            color:
                              currentQuestion.type === 'MCQ'
                                ? 'var(--text-primary)'
                                : currentQuestion.type === 'MSQ'
                                ? 'var(--accent-primary)'
                                : '#d97706'
                          }}
                        >
                          {currentQuestion.type === 'MCQ' ? 'MCQ (Single Correct)' : currentQuestion.type === 'MSQ' ? 'MSQ (Multiple Correct)' : 'NAT (Numerical Answer)'}
                        </span>

                        {/* Marks badge */}
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                          }}
                        >
                          {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                        </span>
                      </div>

                      {/* Flag Button */}
                      <button
                        onClick={() => handleToggleFlag(currentQuestion.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: flaggedQuestions[currentQuestion.id] ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                          border: flaggedQuestions[currentQuestion.id] ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                          color: flaggedQuestions[currentQuestion.id] ? '#f59e0b' : 'var(--text-muted)',
                          padding: '5px 10px',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        <Flag size={14} fill={flaggedQuestions[currentQuestion.id] ? '#f59e0b' : 'none'} />
                        <span>{flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Flag'}</span>
                      </button>
                    </div>

                    {/* Question Statement */}
                    <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '22px' }}>
                      <KaTeXRenderer content={currentQuestion.text} />
                    </div>

                    {/* Question Interactive Input by Type */}

                    {/* TYPE 1: MCQ (Single Choice) */}
                    {currentQuestion.type === 'MCQ' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        {currentQuestion.options.map((optText, optIdx) => {
                          const isSelected = userMcqSelections[currentQuestion.id] === optIdx;
                          const isChecked = checkedQuestions[currentQuestion.id] || (mode === 'exam' && isExamSubmitted);
                          const isCorrectOpt = currentQuestion.correct === optIdx;

                          let borderColor = 'var(--border-subtle)';
                          let bgColor = 'var(--bg-tertiary)';
                          let chipColor = 'var(--text-muted)';
                          let chipBg = 'var(--bg-card)';

                          if (isSelected) {
                            borderColor = 'var(--accent-primary)';
                            bgColor = 'rgba(2, 132, 199, 0.08)';
                            chipColor = '#ffffff';
                            chipBg = 'var(--accent-primary)';
                          }

                          if (isChecked) {
                            if (isCorrectOpt) {
                              borderColor = '#10b981';
                              bgColor = 'rgba(16, 185, 129, 0.12)';
                              chipColor = '#ffffff';
                              chipBg = '#10b981';
                            } else if (isSelected && !isCorrectOpt) {
                              borderColor = '#ef4444';
                              bgColor = 'rgba(239, 68, 68, 0.12)';
                              chipColor = '#ffffff';
                              chipBg = '#ef4444';
                            }
                          }

                          return (
                            <div
                              key={optIdx}
                              onClick={() => handleSelectMcq(optIdx)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                padding: '14px 16px',
                                borderRadius: 'var(--radius-lg)',
                                border: `1.5px solid ${borderColor}`,
                                background: bgColor,
                                cursor: isExamSubmitted ? 'default' : 'pointer',
                                minHeight: '52px'
                              }}
                            >
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: 'var(--radius-md)',
                                  background: chipBg,
                                  color: chipColor,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.88rem',
                                  flexShrink: 0
                                }}
                              >
                                {OPTION_LETTERS[optIdx]}
                              </div>
                              <div style={{ flex: 1, fontSize: '0.94rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                                <KaTeXRenderer content={optText} />
                              </div>
                              {isChecked && isCorrectOpt && (
                                <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                              )}
                              {isChecked && isSelected && !isCorrectOpt && (
                                <XCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* TYPE 2: MSQ (Multiple Choice) */}
                    {currentQuestion.type === 'MSQ' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '4px' }}>
                          Multiple Select Question: One or more options may be correct. No negative marking.
                        </div>
                        {currentQuestion.options.map((optText, optIdx) => {
                          const selectedList = userMsqSelections[currentQuestion.id] || [];
                          const isSelected = selectedList.includes(optIdx);
                          const isChecked = checkedQuestions[currentQuestion.id] || (mode === 'exam' && isExamSubmitted);
                          const isCorrectOpt = (currentQuestion.correctAnswers || []).includes(optIdx);

                          let borderColor = 'var(--border-subtle)';
                          let bgColor = 'var(--bg-tertiary)';

                          if (isSelected) {
                            borderColor = 'var(--accent-primary)';
                            bgColor = 'rgba(2, 132, 199, 0.08)';
                          }

                          if (isChecked) {
                            if (isCorrectOpt) {
                              borderColor = '#10b981';
                              bgColor = 'rgba(16, 185, 129, 0.12)';
                            } else if (isSelected && !isCorrectOpt) {
                              borderColor = '#ef4444';
                              bgColor = 'rgba(239, 68, 68, 0.12)';
                            }
                          }

                          return (
                            <div
                              key={optIdx}
                              onClick={() => handleToggleMsq(optIdx)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                padding: '14px 16px',
                                borderRadius: 'var(--radius-lg)',
                                border: `1.5px solid ${borderColor}`,
                                background: bgColor,
                                cursor: isExamSubmitted ? 'default' : 'pointer',
                                minHeight: '52px'
                              }}
                            >
                              <div
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: 'var(--radius-sm)',
                                  background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                                  border: '1px solid var(--border-subtle)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.84rem',
                                  flexShrink: 0
                                }}
                              >
                                {OPTION_LETTERS[optIdx]}
                              </div>
                              <div style={{ flex: 1, fontSize: '0.94rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                                <KaTeXRenderer content={optText} />
                              </div>
                              {isChecked && isCorrectOpt && (
                                <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                              )}
                              {isChecked && isSelected && !isCorrectOpt && (
                                <XCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* TYPE 3: NAT (Numerical Answer Type) */}
                    {currentQuestion.type === 'NAT' && (
                      <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#d97706', marginBottom: '8px' }}>
                          Numerical Answer Type (NAT)
                        </div>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
                          Enter the exact numerical value or decimal result (e.g. 1.25, -2, 0.5):
                        </p>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="Enter your numerical answer..."
                            value={userNatAnswers[currentQuestion.id] || ''}
                            onChange={(e) => handleNatChange(e.target.value)}
                            disabled={isExamSubmitted}
                            style={{
                              padding: '12px 16px',
                              borderRadius: 'var(--radius-md)',
                              background: 'var(--bg-card)',
                              border: '1.5px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '1.05rem',
                              fontWeight: 700,
                              minWidth: '220px',
                              maxWidth: '320px'
                            }}
                          />
                          {(checkedQuestions[currentQuestion.id] || isExamSubmitted) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {isQuestionCorrect(currentQuestion) ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                                  <CheckCircle2 size={20} />
                                  <span>Correct Answer!</span>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
                                  <XCircle size={20} />
                                  <span>
                                    Incorrect. Allowed Range: [{currentQuestion.ansMin} to {currentQuestion.ansMax}]
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Verdict Banner (In Practice Mode after checking) */}
                    {mode === 'practice' && checkedQuestions[currentQuestion.id] && (
                      <div
                        style={{
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: isQuestionCorrect(currentQuestion) ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                          border: `1px solid ${isQuestionCorrect(currentQuestion) ? '#10b981' : '#ef4444'}`
                        }}
                      >
                        {isQuestionCorrect(currentQuestion) ? (
                          <>
                            <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                              Correct Answer! +{currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle size={20} style={{ color: '#ef4444' }} />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                                Not quite right.
                              </div>
                              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                                {currentQuestion.type === 'MCQ' && currentQuestion.correct !== null && (
                                  <>Correct Option: <strong>({OPTION_LETTERS[currentQuestion.correct]})</strong></>
                                )}
                                {currentQuestion.type === 'MSQ' && (
                                  <>Correct Options: <strong>{(currentQuestion.correctAnswers || []).map((i) => `(${OPTION_LETTERS[i]})`).join(', ')}</strong></>
                                )}
                                {currentQuestion.type === 'NAT' && (
                                  <>Accepted Range: <strong>[{currentQuestion.ansMin} to {currentQuestion.ansMax}]</strong></>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Step-by-Step Solution & Derivation Box */}
                    {(checkedQuestions[currentQuestion.id] || isExamSubmitted || manualShowSolution[currentQuestion.id]) && (
                      <div
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '18px',
                          marginTop: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                          <BookOpen size={18} style={{ color: 'var(--accent-primary)' }} />
                          <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            Detailed Step-by-Step Solution & Derivation
                          </h4>
                        </div>
                        <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                          <KaTeXRenderer content={currentQuestion.solution} />
                        </div>
                      </div>
                    )}

                    {/* Toggle Solution if not yet answered/checked in practice mode */}
                    {mode === 'practice' && !checkedQuestions[currentQuestion.id] && (
                      <button
                        onClick={() => setManualShowSolution((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-primary)',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 0',
                          marginTop: '8px'
                        }}
                      >
                        <HelpCircle size={15} />
                        <span>{manualShowSolution[currentQuestion.id] ? 'Hide Derivation' : 'Show Hint / Derivation'}</span>
                      </button>
                    )}
                  </div>

                  {/* Bottom Navigation Dock (Sticky & Mobile Responsive) */}
                  <div
                    style={{
                      position: 'sticky',
                      bottom: '12px',
                      zIndex: 30,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    <button
                      onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-tertiary)',
                        color: currentIndex === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                        cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ChevronLeft size={18} />
                      <span className="hide-mobile">Prev</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {mode === 'practice' && !checkedQuestions[currentQuestion.id] && (
                        <button
                          onClick={handleCheckAnswer}
                          disabled={!isQuestionAnswered(currentQuestion)}
                          className="btn-preview"
                          style={{
                            padding: '10px 20px',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            opacity: isQuestionAnswered(currentQuestion) ? 1 : 0.6,
                            cursor: isQuestionAnswered(currentQuestion) ? 'pointer' : 'not-allowed'
                          }}
                        >
                          Check Answer
                        </button>
                      )}

                      {mode === 'exam' && !isExamSubmitted && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to submit your GATE test?')) {
                              setIsExamSubmitted(true);
                            }
                          }}
                          className="btn-preview"
                          style={{
                            padding: '10px 20px',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            background: 'var(--accent-primary)',
                            color: '#ffffff'
                          }}
                        >
                          Submit Test
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                      disabled={currentIndex >= filteredQuestions.length - 1}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-tertiary)',
                        color: currentIndex >= filteredQuestions.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                        cursor: currentIndex >= filteredQuestions.length - 1 ? 'not-allowed' : 'pointer',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span className="hide-mobile">Next</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: TOPIC BOOKLETS & PAPERS ==================== */}
      {activeTab === 'booklets' && (
        <div>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              GATE ECE Topic-Wise Booklets & Solutions Manuals
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
              Official offline PDF booklets compiled for all 64 topics. Download question papers (questions only for self-testing) or full step-by-step mathematical solutions manuals.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {catalog.subjects.map((subj) => (
              <div
                key={subj.slug}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getSubjectIcon(subj.slug)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {subj.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {subj.topicsCount} Topics • {subj.questionCount} Questions
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
                  {subj.topics.map((t) => (
                    <div
                      key={t.slug}
                      style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '14px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                          {t.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {t.questionCount} Questions ({t.mcqCount} MCQ • {t.natCount} NAT • {t.msqCount} MSQ)
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {t.pdfQuesUrl && (
                          <button
                            onClick={() => onPreviewPdf && onPreviewPdf(t.pdfQuesUrl!, `${t.title} - Question Paper`)}
                            className="btn-preview"
                            style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                          >
                            <Eye size={13} />
                            <span>Question Paper</span>
                          </button>
                        )}
                        {t.pdfAnsUrl && (
                          <button
                            onClick={() => onPreviewPdf && onPreviewPdf(t.pdfAnsUrl!, `${t.title} - Solutions Manual`)}
                            className="btn-preview"
                            style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                          >
                            <BookOpen size={13} />
                            <span>Solutions Manual</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedSubjectSlug(subj.slug);
                            setSelectedTopicSlug(t.slug);
                            setActiveTab('practice');
                            setCurrentIndex(0);
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: 'var(--accent-primary)',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Sparkles size={13} />
                          <span>Solve ({t.questionCount})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: FORMULA HANDBOOKS ==================== */}
      {activeTab === 'handbooks' && (
        <div>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              GATE ECE Formula Cheat Sheets & Handbooks
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
              High-density reference cards, formula handbooks, and architecture summaries designed for rapid revision before exams.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {(catalog.handbooks || []).map((hb) => (
              <div
                key={hb.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={20} />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                      {hb.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                    {hb.title}
                  </h3>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {hb.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={() => onPreviewPdf && onPreviewPdf(hb.url, hb.title)}
                    className="btn-preview"
                    style={{ flex: 1, padding: '9px 14px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.86rem' }}
                  >
                    <Eye size={15} />
                    <span>In-Browser Preview</span>
                  </button>
                  <a
                    href={hb.url}
                    download={hb.filename}
                    style={{
                      padding: '9px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none'
                    }}
                    title="Download File"
                  >
                    <Download size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: SYLLABUS & WEIGHTAGE ==================== */}
      {activeTab === 'syllabus' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px'
            }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              GATE EC Marks Weightage & Trends (10-Year Analysis)
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 18px 0' }}>
              Average marks distribution based on official IIT GATE question papers (2015–2026). Technical section carries 72 marks, Mathematics 13 marks, General Aptitude 15 marks.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 700 }}>Priority</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 700 }}>Subject</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 700 }}>Avg Marks</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 700 }}>Topics in Vault</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 700 }}>Compiled PYQs</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 700 }}>Quick Practice</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { tier: 'Tier 1', subj: 'Engineering Mathematics', marks: '13 Marks', topics: 6, qs: 254, slug: '01_engineering_mathematics' },
                    { tier: 'Tier 1', subj: 'Communication Systems', marks: '10–12 Marks', topics: 4, qs: 264, slug: '08_communication_systems' },
                    { tier: 'Tier 1', subj: 'Network Theory', marks: '9–11 Marks', topics: 7, qs: 205, slug: '02_network_theory' },
                    { tier: 'Tier 1', subj: 'Electronic Devices (EDC)', marks: '9–11 Marks', topics: 4, qs: 196, slug: '04_electronic_devices' },
                    { tier: 'Tier 2', subj: 'Analog Circuits', marks: '8–10 Marks', topics: 8, qs: 250, slug: '05_analog_circuits' },
                    { tier: 'Tier 2', subj: 'Digital Circuits', marks: '8–10 Marks', topics: 9, qs: 200, slug: '06_digital_circuits' },
                    { tier: 'Tier 2', subj: 'Control Systems', marks: '8–10 Marks', topics: 7, qs: 210, slug: '07_control_systems' },
                    { tier: 'Tier 2', subj: 'Signals & Systems', marks: '7–9 Marks', topics: 9, qs: 238, slug: '03_signals_and_systems' },
                    { tier: 'Tier 2', subj: 'Electromagnetics (EMT)', marks: '7–9 Marks', topics: 5, qs: 175, slug: '09_electromagnetics' },
                    { tier: 'Tier 3', subj: '8085 Microprocessor', marks: '1–3 Marks', topics: 5, qs: 36, slug: '10_microprocessors' }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            background: row.tier === 'Tier 1' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)',
                            color: row.tier === 'Tier 1' ? '#ef4444' : 'var(--text-secondary)'
                          }}
                        >
                          {row.tier}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>{row.subj}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--accent-primary)' }}>{row.marks}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{row.topics} Topics</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{row.qs} Questions</td>
                      <td style={{ padding: '10px 14px' }}>
                        <button
                          onClick={() => {
                            setSelectedSubjectSlug(row.slug);
                            setSelectedTopicSlug('ALL');
                            setActiveTab('practice');
                            setCurrentIndex(0);
                          }}
                          style={{
                            padding: '5px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--accent-primary)',
                            cursor: 'pointer'
                          }}
                        >
                          Solve All
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Floating / Slide-up Palette Sheet */}
      {isPaletteOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setIsPaletteOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '100%',
              background: 'var(--bg-card)',
              borderLeft: '1px solid var(--border-subtle)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Question Palette
              </div>
              <button onClick={() => setIsPaletteOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Filter Pills in Palette */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {(['ALL', 'ANSWERED', 'UNANSWERED', 'FLAGGED'] as const).map((pf) => (
                <button
                  key={pf}
                  onClick={() => setPaletteFilter(pf)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: '1px solid var(--border-subtle)',
                    background: paletteFilter === pf ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: paletteFilter === pf ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {pf}
                </button>
              ))}
            </div>

            {/* Grid of question numbers */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', alignContent: 'start' }}>
              {filteredQuestions.map((q, idx) => {
                const answered = isQuestionAnswered(q);
                const isFlag = !!flaggedQuestions[q.id];
                const isCur = idx === currentIndex;

                if (paletteFilter === 'ANSWERED' && !answered) return null;
                if (paletteFilter === 'UNANSWERED' && answered) return null;
                if (paletteFilter === 'FLAGGED' && !isFlag) return null;

                let bg = 'var(--bg-tertiary)';
                let color = 'var(--text-secondary)';
                let border = '1px solid var(--border-subtle)';

                if (answered) {
                  bg = 'rgba(16, 185, 129, 0.15)';
                  color = '#10b981';
                  border = '1px solid #10b981';
                }
                if (isCur) {
                  border = '2px solid var(--accent-primary)';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => { setCurrentIndex(idx); setIsPaletteOpen(false); }}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 'var(--radius-md)',
                      background: bg,
                      color: color,
                      border: border,
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <span>{idx + 1}</span>
                    {isFlag && (
                      <span style={{ position: 'absolute', top: '2px', right: '2px', width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
