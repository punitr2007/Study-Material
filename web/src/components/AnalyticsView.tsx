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
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);

  if (!analyticsData || !analyticsData.subjects) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading syllabus weightage analytics...</p>
      </div>
    );
  }

  const subjectKeys = Object.keys(analyticsData.subjects);
  const activeSubjectKey =
    selectedSubjectId && analyticsData.subjects[selectedSubjectId]
      ? selectedSubjectId
      : subjectKeys[0];
  const subject: SubjectAnalytics = analyticsData.subjects[activeSubjectKey];

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

  return (
    <div className="analytics-view-container">
      {/* Header Banner */}
      <div className="analytics-header-banner">
        <div className="banner-badge-group">
          <span className="banner-badge">
            <BarChart3 size={14} className="inline-icon" /> 5-Year Historical Analysis (2021–2026)
          </span>
          <span className="banner-badge subtle">
            {analyticsData.metadata.curator}
          </span>
        </div>
        <h1 className="analytics-page-title">Syllabus Coverage & Exam Weightage Analytics</h1>
        <p className="analytics-subtitle">
          Data-driven topic frequency analysis, exam unit distributions, and high-yield question patterns parsed from authentic university examination papers.
        </p>
      </div>

      {/* Subject Switcher Tabs */}
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

      {/* Subject Overview Card */}
      <div className="subject-overview-card">
        <div className="overview-header">
          <div>
            <div className="subject-code-tag-group">
              <span className="code-pill primary">{subject.primary_code}</span>
              <span className="code-pill">Structure: {subject.structure}</span>
              <span className="code-pill">Credits: {subject.credits}</span>
            </div>
            <h2 className="overview-title">{subject.name}</h2>
            <div className="aliased-codes-line">
              <strong>Applicable Exam Paper Codes:</strong>{' '}
              {subject.aliased_codes.join(', ')}
            </div>
          </div>
          <div className="overview-stat-box">
            <div className="stat-num">{subject.topic_metrics.length}</div>
            <div className="stat-label">Analyzed High-Yield Topics</div>
          </div>
        </div>

        {/* Course Outcomes */}
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
            Primary focus on foundational units with extensive derivation and analytical problems.
          </p>
          <div className="weightage-bars">
            {Object.entries(subject.unit_weightage_midsem).map(([unitName, percent]) => (
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
            Even distribution across all syllabus units with comprehensive transform domain application.
          </p>
          <div className="weightage-bars">
            {Object.entries(subject.unit_weightage_endsem).map(([unitName, percent]) => (
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

      {/* Topic Recurrence & Yield Breakdown */}
      <div className="topic-analytics-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">
              <Flame size={20} className="inline-icon text-danger" /> High-Yield Exam Topics
            </h2>
            <p className="section-desc">
              Topics ranked by historical exam recurrence percentage and average mark allocation.
            </p>
          </div>
        </div>

        <div className="topic-metrics-grid">
          {subject.topic_metrics.map((item, idx) => (
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
            </div>
          ))}
        </div>
      </div>

      {/* Official Syllabus Units Accordion */}
      <div className="syllabus-units-section">
        <h2 className="section-title">
          <BookOpen size={20} className="inline-icon text-accent" /> Official Syllabus Units Breakdown
        </h2>
        <div className="units-accordion">
          {subject.units.map((unit) => {
            const isExpanded = expandedUnit === unit.unit_num;
            return (
              <div key={unit.unit_num} className="accordion-card">
                <button
                  className="accordion-header"
                  onClick={() =>
                    setExpandedUnit(isExpanded ? null : unit.unit_num)
                  }
                >
                  <div className="accordion-title-left">
                    <span className="unit-number-tag">Unit {unit.unit_num}</span>
                    <span className="accordion-unit-title">{unit.title}</span>
                  </div>
                  <div className="accordion-right-info">
                    <span className="topics-count-badge">
                      {unit.topics.length} Syllabus Topics
                    </span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="accordion-content">
                    <ul className="syllabus-topic-list">
                      {unit.topics.map((t, tIdx) => (
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
            <Target size={18} className="inline-icon text-accent" /> Exam Preparation Strategy
          </h3>
          <ul className="strategy-list">
            {subject.exam_strategy_notes.map((note, nIdx) => (
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
            <BookOpen size={18} className="inline-icon text-primary" /> Prescribed Course Textbooks
          </h3>
          <div className="textbook-items">
            {subject.textbooks.map((tb, tbIdx) => (
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
