import React, { useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Award,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  TrendingUp,
  Lightbulb,
  FileCheck2,
} from 'lucide-react';
import type { AnalyticsData, SubjectAnalytics } from '../types/analytics';

interface AnalyticsViewProps {
  analyticsData: AnalyticsData | null;
  selectedSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  onOpenSolutionsForTopic?: (topic: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analyticsData,
  selectedSubjectId,
  onSelectSubject,
}) => {
  const [expandedUnit, setExpandedUnit] = useState<number | null>(1);
  const [activeYieldFilter, setActiveYieldFilter] = useState<string>('ALL');

  if (!analyticsData || !analyticsData.subjects) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading syllabus coverage & exam weightage analytics...</p>
      </div>
    );
  }

  const subjectKeys = Object.keys(analyticsData.subjects);
  if (subjectKeys.length === 0) {
    return (
      <div className="analytics-loading">
        <p>No subject analytics available. Please run analysis sync.</p>
      </div>
    );
  }

  const activeSubjectKey =
    selectedSubjectId && analyticsData.subjects[selectedSubjectId]
      ? selectedSubjectId
      : subjectKeys[0];
  const subject: SubjectAnalytics =
    analyticsData.subjects[activeSubjectKey] || analyticsData.subjects[subjectKeys[0]];

  const getYieldBadgeClass = (category: string) => {
    switch (category) {
      case 'CRITICAL':
        return 'yield-badge-critical';
      case 'HIGH':
        return 'yield-badge-high';
      case 'MEDIUM':
        return 'yield-badge-medium';
      default:
        return 'yield-badge-emerging';
    }
  };

  const filteredTopics = (subject.topic_metrics || []).filter((topic) => {
    if (activeYieldFilter === 'ALL') return true;
    return topic.yield_category === activeYieldFilter;
  });

  return (
    <div className="analytics-view-container">
      {/* Header Banner */}
      <div className="analytics-header-banner">
        <div className="banner-badge-group">
          <span className="banner-badge">
            <BarChart3 size={14} className="inline-icon" /> 5-Year Historical Analysis (2021–2026)
          </span>
          <span className="banner-badge subtle">
            {analyticsData.metadata?.historical_data_span || 'Past 5 Years'}
          </span>
        </div>
        <h1 className="analytics-page-title">Syllabus Coverage & Exam Weightage Analytics</h1>
        <p className="analytics-subtitle">
          Data-driven topic frequency analysis, exam unit distributions, and high-yield question patterns parsed from authentic university examination papers.
        </p>
      </div>

      {/* Subject Switcher Tabs */}
      <div className="analytics-subject-tabs-container">
        <div className="analytics-subject-tabs">
          {subjectKeys.map((key) => {
            const s = analyticsData.subjects[key];
            const isActive = key === activeSubjectKey;
            return (
              <button
                key={key}
                className={`analytics-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectSubject(key)}
              >
                <span className="tab-code">{s.primary_code}</span>
                <span className="tab-name">{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Overview Card */}
      <div className="subject-overview-card">
        <div className="overview-header">
          <div className="overview-header-left">
            <div className="subject-code-tag-group">
              <span className="code-pill primary">{subject.primary_code}</span>
              <span className="code-pill">Structure: {subject.structure || '3-1-0'}</span>
              <span className="code-pill">Credits: {subject.credits || 4}</span>
            </div>
            <h2 className="overview-title">{subject.name}</h2>
            <div className="aliased-codes-line">
              <strong>Applicable Exam Paper Codes:</strong>{' '}
              {(subject.aliased_codes || []).join(', ')}
            </div>
          </div>
          <div className="overview-stat-box">
            <div className="stat-num">{(subject.topic_metrics || []).length}</div>
            <div className="stat-label">High-Yield Exam Topics</div>
            {subject.total_questions_indexed ? (
              <div className="stat-sublabel">{subject.total_questions_indexed}+ Question Instances</div>
            ) : null}
          </div>
        </div>

        {/* Course Outcomes */}
        {(subject.course_outcomes || []).length > 0 && (
          <div className="course-outcomes-section">
            <h3 className="section-subheading">
              <Target size={16} className="inline-icon" /> Course Learning Outcomes (COs)
            </h3>
            <div className="co-grid">
              {subject.course_outcomes.map((co, idx) => (
                <div key={idx} className="co-item">
                  <CheckCircle2 size={15} className="co-check" />
                  <span>{co}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Weightage Comparison Grid */}
      <div className="weightage-grid">
        {/* Mid-Sem Weightage */}
        <div className="weightage-card">
          <div className="weightage-card-header">
            <div className="weightage-title-group">
              <TrendingUp size={18} className="text-accent" />
              <h3>Mid-Semester Unit Weightage</h3>
            </div>
            <span className="weightage-badge midsem">Mid-Sem Target</span>
          </div>
          <p className="weightage-desc">
            Primary focus on foundational units with extensive derivations, proofs, and standard analytical problems.
          </p>
          <div className="weightage-bars">
            {Object.entries(subject.unit_weightage_midsem || {}).map(([unitName, percent]) => (
              <div key={unitName} className="weightage-bar-item">
                <div className="bar-label-row">
                  <span className="bar-unit-name">{unitName}</span>
                  <span className="bar-percent">{percent}%</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill midsem-fill"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* End-Sem Weightage */}
        <div className="weightage-card">
          <div className="weightage-card-header">
            <div className="weightage-title-group">
              <Award size={18} className="text-primary" />
              <h3>End-Semester Unit Weightage</h3>
            </div>
            <span className="weightage-badge endsem">End-Sem Target</span>
          </div>
          <p className="weightage-desc">
            Balanced distribution across all 5 syllabus units with comprehensive transform-domain and multi-stage designs.
          </p>
          <div className="weightage-bars">
            {Object.entries(subject.unit_weightage_endsem || {}).map(([unitName, percent]) => (
              <div key={unitName} className="weightage-bar-item">
                <div className="bar-label-row">
                  <span className="bar-unit-name">{unitName}</span>
                  <span className="bar-percent">{percent}%</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill endsem-fill"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Exam Preparation Strategy */}
      {subject.exam_strategy && (
        <div className="strategy-focus-section">
          <div className="strategy-focus-card midsem">
            <div className="strategy-focus-header">
              <Target size={18} className="text-accent" />
              <h4>Mid-Semester Strategic Directive</h4>
            </div>
            <p className="strategy-focus-text">
              {subject.exam_strategy.midsem_focus || 'Focus heavily on Unit 1 and Unit 2 definitions and numerical exercises.'}
            </p>
          </div>
          <div className="strategy-focus-card endsem">
            <div className="strategy-focus-header">
              <Award size={18} className="text-primary" />
              <h4>End-Semester Strategic Directive</h4>
            </div>
            <p className="strategy-focus-text">
              {subject.exam_strategy.endsem_focus || 'Cover Units 3 to 5 thoroughly as advanced applications hold over 60% weight.'}
            </p>
          </div>
        </div>
      )}

      {/* Topic Recurrence & Yield Breakdown */}
      <div className="topic-analytics-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">
              <Flame size={20} className="inline-icon text-danger" /> High-Yield Exam Topics
            </h2>
            <p className="section-desc">
              Topics ranked by historical exam recurrence percentage and average mark allocation across 5 years of PYQs.
            </p>
          </div>

          <div className="yield-filter-group">
            {['ALL', 'CRITICAL', 'HIGH'].map((cat) => (
              <button
                key={cat}
                className={`yield-filter-btn ${activeYieldFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveYieldFilter(cat)}
              >
                {cat === 'ALL' ? 'All Priorities' : `${cat} Only`}
              </button>
            ))}
          </div>
        </div>

        <div className="topic-metrics-grid">
          {filteredTopics.map((item, idx) => (
            <div key={idx} className="topic-metric-card">
              <div className="metric-header">
                <span className="unit-pill">Unit {item.unit}</span>
                <span className={`yield-badge ${getYieldBadgeClass(item.yield_category)}`}>
                  {item.yield_category} PRIORITY
                </span>
              </div>

              <h4 className="topic-name">{item.topic}</h4>

              <div className="metric-stats-row">
                <div className="recurrence-box">
                  <span className="recurrence-val">{item.recurrence_rate}%</span>
                  <span className="recurrence-lbl">Recurrence Rate</span>
                </div>
                <div className="marks-box">
                  <span className="marks-val">~{item.avg_marks_per_exam}</span>
                  <span className="marks-lbl">Avg Marks / Exam</span>
                </div>
              </div>

              <div className="trend-tag">
                <Sparkles size={13} className="inline-icon" /> {item.exam_frequency_trend}
              </div>

              {(item.core_concepts || []).length > 0 && (
                <div className="core-concepts-section">
                  <span className="concepts-title">Key Derivations & Concepts:</span>
                  <div className="concept-tags">
                    {item.core_concepts.map((concept, cIdx) => (
                      <span key={cIdx} className="concept-tag">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Official Syllabus Units Accordion */}
      <div className="syllabus-units-section">
        <div className="syllabus-section-header">
          <div>
            <h2 className="section-title">
              <BookOpen size={20} className="inline-icon text-accent" /> Official Syllabus Units Breakdown
            </h2>
            <p className="section-desc">
              Complete unit-wise topic lists synced directly from verified university syllabus specifications.
            </p>
          </div>
          <button
            className="expand-all-btn"
            onClick={() => setExpandedUnit(expandedUnit === null ? 1 : null)}
          >
            {expandedUnit !== null ? 'Collapse All' : 'Expand Unit 1'}
          </button>
        </div>

        <div className="units-accordion">
          {(subject.units || []).map((unit) => {
            const isExpanded = expandedUnit === unit.unit_num;
            return (
              <div key={unit.unit_num} className="accordion-card">
                <button
                  className="accordion-header"
                  onClick={() =>
                    setExpandedUnit(isExpanded ? null : unit.unit_num)
                  }
                  aria-expanded={isExpanded}
                >
                  <div className="accordion-title-left">
                    <span className="unit-number-tag">Unit {unit.unit_num}</span>
                    <span className="accordion-unit-title">{unit.title}</span>
                  </div>
                  <div className="accordion-right-info">
                    <span className="topics-count-badge">
                      {(unit.topics || []).length} Syllabus Topics
                    </span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="accordion-content">
                    <ul className="syllabus-topic-list">
                      {(unit.topics || []).map((t, tIdx) => (
                        <li key={tIdx} className="syllabus-topic-item">
                          <span className="topic-bullet">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam Strategy & Recommended Textbooks */}
      <div className="strategy-textbooks-grid">
        {/* Strategy Notes */}
        <div className="strategy-card">
          <h3 className="sub-card-title">
            <Lightbulb size={18} className="inline-icon text-accent" /> Preparation Guidelines & Insights
          </h3>
          <ul className="strategy-list">
            {(subject.exam_strategy_notes || [
              'Solve past 5 years papers repeatedly for 90%+ recurrence questions.',
              'Derive all standard proofs and state initial assumptions clearly.',
              'Cross-check final algebraic expressions against textbook examples.'
            ]).map((note, nIdx) => (
              <li key={nIdx} className="strategy-item">
                <span className="strategy-number">{nIdx + 1}</span>
                <span className="strategy-text">{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reference Textbooks */}
        <div className="textbooks-card">
          <h3 className="sub-card-title">
            <FileCheck2 size={18} className="inline-icon text-primary" /> Prescribed Course Textbooks & Readings
          </h3>
          <div className="textbook-items">
            {(subject.textbooks || []).map((tb, tbIdx) => (
              <div key={tbIdx} className="textbook-item">
                <div className="tb-icon-circle">
                  <BookOpen size={15} />
                </div>
                <div className="tb-details">
                  <span className="tb-title">{tb}</span>
                  <span className="tb-role">Standard University Reference</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
