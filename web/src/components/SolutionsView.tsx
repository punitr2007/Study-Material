import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  Award,
  ChevronRight,
  Filter,
  Hash,
  X,
} from 'lucide-react';
import type { SolutionsData, QuestionSolution } from '../types/solutions';
import { KaTeXRenderer } from './KaTeXRenderer';

interface SolutionsViewProps {
  solutionsData: SolutionsData | null;
  selectedSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  onSelectSolution: (solution: QuestionSolution) => void;
}

export const SolutionsView: React.FC<SolutionsViewProps> = ({
  solutionsData,
  selectedSubjectId,
  onSelectSubject,
  onSelectSolution,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamType, setSelectedExamType] = useState<string>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<number | 'ALL'>('ALL');

  const allSolutionsList = useMemo(() => {
    if (!solutionsData || !solutionsData.solutions) return [];
    const list: (QuestionSolution & { subjectId: string })[] = [];
    for (const [subId, questions] of Object.entries(solutionsData.solutions)) {
      for (const q of questions) {
        list.push({ ...q, subjectId: subId });
      }
    }
    return list;
  }, [solutionsData]);

  const filteredSolutions = useMemo(() => {
    return allSolutionsList.filter((item) => {
      // Subject filter
      if (selectedSubjectId !== 'ALL' && item.subjectId !== selectedSubjectId) {
        return false;
      }
      // Exam type filter
      if (selectedExamType !== 'ALL' && item.exam_type !== selectedExamType) {
        return false;
      }
      // Unit filter
      if (selectedUnit !== 'ALL' && item.unit !== selectedUnit) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTopic = item.topic.toLowerCase().includes(q);
        const matchesQuestion = item.question.toLowerCase().includes(q);
        const matchesCode = item.subject_code.toLowerCase().includes(q);
        const matchesRef = item.reference.toLowerCase().includes(q);
        const matchesId = item.question_id.toLowerCase().includes(q);
        if (!matchesTopic && !matchesQuestion && !matchesCode && !matchesRef && !matchesId) {
          return false;
        }
      }
      return true;
    });
  }, [allSolutionsList, selectedSubjectId, selectedExamType, selectedUnit, searchQuery]);

  if (!solutionsData || !solutionsData.solutions) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading AI-grounded solutions...</p>
      </div>
    );
  }

  const subjectKeys = Object.keys(solutionsData.solutions);

  return (
    <div className="solutions-view-container">
      {/* Header Banner */}
      <div className="solutions-header-banner">
        <div className="banner-badge-group">
          <span className="banner-badge primary">
            <Sparkles size={14} className="inline-icon" /> AI-Assisted Problem Solutions
          </span>
          <span className="banner-badge subtle">Textbook Grounded</span>
        </div>
        <h1 className="solutions-page-title">Instant Exam Question Solutions</h1>
        <p className="solutions-subtitle">
          Comprehensive step-by-step derivations and mathematical solutions for past mid-sem and end-sem exam questions, fully referenced to standard university textbooks.
        </p>
      </div>

      {/* Controls Bar: Search & Filter Pills */}
      <div className="solutions-controls-panel">
        {/* Search Input */}
        <div className="solutions-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search questions by keyword, topic, subject code, or equation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Subject Selector Tabs */}
        <div className="solutions-subject-tabs">
          <button
            className={`subject-pill ${selectedSubjectId === 'ALL' ? 'active' : ''}`}
            onClick={() => onSelectSubject('ALL')}
          >
            All Subjects ({allSolutionsList.length})
          </button>
          {subjectKeys.map((key) => {
            const count = (solutionsData.solutions[key] || []).length;
            const shortName = key.replace(/^\d+_/, '').split('_E')[0].replace(/_/g, ' ');
            return (
              <button
                key={key}
                className={`subject-pill ${selectedSubjectId === key ? 'active' : ''}`}
                onClick={() => onSelectSubject(key)}
              >
                {shortName} ({count})
              </button>
            );
          })}
        </div>

        {/* Filter Rows */}
        <div className="filter-pills-row">
          <div className="filter-group">
            <span className="filter-label">
              <Filter size={13} className="inline-icon" /> Exam:
            </span>
            <button
              className={`filter-chip ${selectedExamType === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedExamType('ALL')}
            >
              All Exams
            </button>
            <button
              className={`filter-chip ${selectedExamType === 'Mid_Semester' ? 'active' : ''}`}
              onClick={() => setSelectedExamType('Mid_Semester')}
            >
              Mid-Semester
            </button>
            <button
              className={`filter-chip ${selectedExamType === 'End_Semester' ? 'active' : ''}`}
              onClick={() => setSelectedExamType('End_Semester')}
            >
              End-Semester
            </button>
          </div>

          <div className="filter-group">
            <span className="filter-label">Unit:</span>
            <button
              className={`filter-chip ${selectedUnit === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedUnit('ALL')}
            >
              All Units
            </button>
            {[1, 2, 3, 4, 5].map((u) => (
              <button
                key={u}
                className={`filter-chip ${selectedUnit === u ? 'active' : ''}`}
                onClick={() => setSelectedUnit(u)}
              >
                Unit {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="solutions-results-header">
        <span className="results-count">
          Showing <strong>{filteredSolutions.length}</strong> solved questions
        </span>
      </div>

      {filteredSolutions.length === 0 ? (
        <div className="no-solutions-card">
          <BookOpen size={40} className="empty-icon" />
          <h3>No Solved Questions Found</h3>
          <p>Try clearing your search query or selecting a different subject or filter.</p>
          <button
            className="btn-primary"
            onClick={() => {
              setSearchQuery('');
              setSelectedExamType('ALL');
              setSelectedUnit('ALL');
              onSelectSubject('ALL');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="solutions-grid">
          {filteredSolutions.map((item) => (
            <div
              key={item.question_id}
              className="solution-preview-card"
              onClick={() => onSelectSolution(item)}
            >
              {/* Card Top Badges */}
              <div className="card-badge-row">
                <div className="left-badges">
                  <span className="badge badge-subtle">Unit {item.unit}</span>
                  <span className="badge badge-accent">{item.exam}</span>
                  <span className="badge badge-code">{item.subject_code}</span>
                </div>
                <div className="right-badges">
                  <span className="badge badge-marks">
                    <Award size={12} className="inline-icon" /> {item.marks} Marks
                  </span>
                </div>
              </div>

              {/* Topic Title */}
              <h3 className="card-topic-title">{item.topic}</h3>

              {/* Question Preview */}
              <div className="card-question-preview">
                <KaTeXRenderer content={item.question} />
              </div>

              {/* Reference */}
              {item.reference && (
                <div className="card-ref-footer">
                  <BookOpen size={13} className="ref-book-icon" />
                  <span className="ref-footer-text">{item.reference}</span>
                </div>
              )}

              {/* Bottom Action */}
              <div className="card-action-bar">
                <span className="hash-indicator">
                  <Hash size={11} className="inline-icon" /> {item.question_hash}
                </span>
                <button
                  className="view-solution-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSolution(item);
                  }}
                >
                  View Step-by-Step Solution <ChevronRight size={14} className="inline-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
