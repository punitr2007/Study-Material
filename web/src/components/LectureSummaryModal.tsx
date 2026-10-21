import React from 'react';
import { X, BookOpen, ExternalLink, Copy, Check } from 'lucide-react';
import type { LectureSummariesDatabase } from '../types/lectures';
import lectureDataJson from '../data/nptel_lecture_summaries.json';
import { KaTeXRenderer } from './KaTeXRenderer';

const lectureDb = lectureDataJson as LectureSummariesDatabase;

interface LectureSummaryModalProps {
  lectureIdentifier: string | number; // e.g. "Lecture 19" or 19
  isOpen: boolean;
  onClose: () => void;
  onOpenFullSummaries?: (lecNum: number) => void;
}

export const LectureSummaryModal: React.FC<LectureSummaryModalProps> = ({
  lectureIdentifier,
  isOpen,
  onClose,
  onOpenFullSummaries,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  // Extract integer lecture number from string like "Lecture 19", "Lecture 19: ...", or 19
  const numMatch = String(lectureIdentifier).match(/\d+/);
  const lecNum = numMatch ? parseInt(numMatch[0], 10) : 1;

  const lecture = lectureDb.lectures.find((l) => l.lectureNumber === lecNum) || lectureDb.lectures[0];

  const handleCopy = () => {
    if (!lecture) return;
    navigator.clipboard.writeText(lecture.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="lecture-summary-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--accent-primary)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  WEEK {lecture.week} • LECTURE {lecture.lectureNumber}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  IIT Kanpur / NPTEL
                </span>
              </div>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {lecture.title}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleCopy}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Copy markdown"
            >
              {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {onOpenFullSummaries && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFullSummaries(lecture.lectureNumber);
                }}
                style={{
                  background: 'var(--accent-primary)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Full Guide</span>
                <ExternalLink size={13} />
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1,
            lineHeight: 1.7,
            color: 'var(--text-primary)',
          }}
        >
          {/* Subheadings Overview */}
          {lecture.subheadings.length > 0 && (
            <div
              style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Key Topics in this Lecture
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {lecture.subheadings.map((sh, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.78rem',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {sh}
                  </span>
                ))}
              </div>
            </div>
          )}

          <KaTeXRenderer content={lecture.content} />
        </div>
      </div>
    </div>
  );
};
