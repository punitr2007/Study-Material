import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import type { LectureSummariesDatabase } from '../types/lectures';
import lectureDataJson from '../data/nptel_lecture_summaries.json';
import { KaTeXRenderer } from './KaTeXRenderer';

const lectureDb = lectureDataJson as LectureSummariesDatabase;

interface NptelLectureSummariesViewProps {
  initialLectureNumber?: number;
  initialWeek?: number;
  onSwitchToQuiz?: () => void;
}

export const NptelLectureSummariesView: React.FC<NptelLectureSummariesViewProps> = ({
  initialLectureNumber = 13,
  initialWeek = 3,
  onSwitchToQuiz,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(initialWeek);
  const [selectedLectureNum, setSelectedLectureNum] = useState<number>(initialLectureNumber);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Filtered lectures based on week and search
  const filteredLectures = useMemo(() => {
    let list = selectedWeek === 0
      ? lectureDb.lectures
      : lectureDb.lectures.filter((l) => l.week === selectedWeek);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = lectureDb.lectures.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.content.toLowerCase().includes(q) ||
          l.subheadings.some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedWeek, searchQuery]);

  // Selected lecture object
  const activeLecture = useMemo(() => {
    const found = lectureDb.lectures.find((l) => l.lectureNumber === selectedLectureNum);
    return found || filteredLectures[0] || lectureDb.lectures[0];
  }, [selectedLectureNum, filteredLectures]);

  // Active week metadata
  const activeWeekMeta = useMemo(() => {
    return lectureDb.weeks.find((w) => w.week === activeLecture?.week);
  }, [activeLecture]);

  // Previous and next lectures
  const prevLecture = useMemo(() => {
    const idx = lectureDb.lectures.findIndex((l) => l.lectureNumber === activeLecture?.lectureNumber);
    return idx > 0 ? lectureDb.lectures[idx - 1] : null;
  }, [activeLecture]);

  const nextLecture = useMemo(() => {
    const idx = lectureDb.lectures.findIndex((l) => l.lectureNumber === activeLecture?.lectureNumber);
    return idx < lectureDb.lectures.length - 1 ? lectureDb.lectures[idx + 1] : null;
  }, [activeLecture]);

  // Copy active lecture content
  const handleCopyContent = () => {
    if (!activeLecture) return;
    navigator.clipboard.writeText(activeLecture.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="nptel-lecture-summaries-view" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 0' }}>
      {/* Header Banner */}
      <div className="nptel-quiz-header-card" style={{ marginBottom: '20px' }}>
        <div className="nptel-header-left">
          <div className="nptel-course-badge">
            <GraduationCap size={16} />
            <span>NPTEL 109104107 • IIT Kanpur</span>
          </div>
          <h1 className="nptel-course-title">
            Developing Soft Skills and Personality: Complete 48 Lecture Revision Guides
          </h1>
          <p className="nptel-instructor">
            Instructor: Prof. T. Ravichandran • High-Yield Pedagogical Summaries, Models & Case Studies
          </p>
        </div>

        <div className="nptel-header-actions" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <a
            href="/Complete-Soft-Skills-Exam-Revision-Guide-All-Lectures.md"
            download="Complete-Soft-Skills-Exam-Revision-Guide-All-Lectures.md"
            className="btn-download-pdf-nptel"
            title="Download unified 220KB Master Revision Markdown Guide (All 48 Lectures)"
            style={{ textDecoration: 'none' }}
          >
            <Download size={15} />
            <span>Master Guide (.md)</span>
          </a>

          {onSwitchToQuiz && (
            <button
              onClick={onSwitchToQuiz}
              className="btn-reset-quiz"
              style={{
                borderColor: 'var(--accent-primary)',
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--accent-primary)',
              }}
            >
              <Sparkles size={15} />
              <span>Practice MCQs (200 Qs)</span>
            </button>
          )}
        </div>
      </div>

      {/* Week Selector Bar */}
      <div className="nptel-week-selector-bar" style={{ marginBottom: '16px' }}>
        <button
          className={`nptel-week-btn ${selectedWeek === 0 ? 'active' : ''}`}
          onClick={() => {
            setSelectedWeek(0);
            setSearchQuery('');
          }}
        >
          <Layers size={14} />
          <span>All 48 Lectures</span>
        </button>

        {lectureDb.weeks.map((w) => (
          <button
            key={w.week}
            className={`nptel-week-btn ${selectedWeek === w.week ? 'active' : ''}`}
            onClick={() => {
              setSelectedWeek(w.week);
              setSearchQuery('');
              // set first lecture of week
              const firstLec = (w.week - 1) * 6 + 1;
              setSelectedLectureNum(firstLec);
            }}
          >
            <span className="week-num-pill">W{w.week}</span>
            <span className="week-title-short">{w.title.split('&')[0].trim()}</span>
          </button>
        ))}
      </div>

      {/* Week Meta Overview */}
      {activeWeekMeta && selectedWeek !== 0 && (
        <div className="nptel-week-info-strip" style={{ marginBottom: '16px' }}>
          <div className="week-info-left">
            <span className="week-badge-pill">Week {activeWeekMeta.week} Modules</span>
            <span className="week-lectures-pill">{activeWeekMeta.lectures}</span>
            <span className="week-desc-text">{activeWeekMeta.description}</span>
          </div>
        </div>
      )}

      {/* Search and Fast Concept Pills */}
      <div
        className="nptel-controls-toolbar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        {/* Search Box */}
        <div className="search-filter-box" style={{ flex: '1 1 320px', maxWidth: '420px' }}>
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search concepts, stories, models (e.g. Zeigarnik, Dopamine, Mehrabian)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-quiz-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>

        {/* Quick Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {['Zeigarnik Effect', 'Dopamine Loop', 'Active Listening', 'Telephone HEAT', 'Netiquette', 'Mehrabian 7-38-55', 'Stage Fright', '5 Reading Skills'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              style={{
                fontSize: '0.74rem',
                padding: '4px 9px',
                borderRadius: '6px',
                background: searchQuery === tag ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: searchQuery === tag ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Lecture Navigator Pills */}
      <div
        className="lecture-navigator-strip"
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '10px',
          marginBottom: '20px',
          scrollbarWidth: 'none',
        }}
      >
        {filteredLectures.map((lec) => {
          const isSelected = activeLecture?.lectureNumber === lec.lectureNumber;
          return (
            <button
              key={lec.lectureNumber}
              onClick={() => setSelectedLectureNum(lec.lectureNumber)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-lg)',
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: isSelected ? '0 4px 14px rgba(99, 102, 241, 0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span
                style={{
                  background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(99, 102, 241, 0.15)',
                  color: isSelected ? '#ffffff' : 'var(--accent-primary)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                }}
              >
                L{lec.lectureNumber}
              </span>
              <span>{lec.title.split('—')[0].replace('Habits:', '').replace('Communication:', '').replace('Technology and Communication:', '').trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Active Lecture Reader Card */}
      {activeLecture && (
        <div
          className="lecture-reader-card"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          {/* Lecture Meta Header */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '20px',
              marginBottom: '24px',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--accent-primary)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                  }}
                >
                  WEEK {activeLecture.week}
                </span>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                  }}
                >
                  LECTURE {activeLecture.lectureNumber} OF 48
                </span>
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                {activeLecture.title}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleCopyContent}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Copy markdown content to clipboard"
              >
                {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
              </button>
            </div>
          </div>

          {/* Subheadings Overview Strip */}
          {activeLecture.subheadings.length > 0 && (
            <div
              style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 18px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                }}
              >
                Core Concepts Explored
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {activeLecture.subheadings.map((sh, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.82rem',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      fontWeight: 600,
                    }}
                  >
                    {sh}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Markdown & KaTeX Rendered Content */}
          <div className="lecture-markdown-body" style={{ color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '0.96rem' }}>
            <KaTeXRenderer content={activeLecture.content} />
          </div>

          {/* Bottom Pagination Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '24px',
              marginTop: '32px',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {prevLecture ? (
              <button
                onClick={() => setSelectedLectureNum(prevLecture.lectureNumber)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={16} />
                <span>Prev: Lec {prevLecture.lectureNumber}</span>
              </button>
            ) : <div />}

            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Lecture {activeLecture.lectureNumber} of {lectureDb.totalLectures}
            </span>

            {nextLecture ? (
              <button
                onClick={() => setSelectedLectureNum(nextLecture.lectureNumber)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--accent-primary)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                }}
              >
                <span>Next: Lec {nextLecture.lectureNumber}</span>
                <ChevronRight size={16} />
              </button>
            ) : <div />}
          </div>
        </div>
      )}
    </div>
  );
};
