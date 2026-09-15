import React, { useEffect, useState } from 'react';
import { X, BookOpen, AlertTriangle, Check, Copy, Hash, Sparkles, Award } from 'lucide-react';
import type { QuestionSolution } from '../types/solutions';
import { KaTeXRenderer } from './KaTeXRenderer';

interface SolutionViewerModalProps {
  solution: QuestionSolution | null;
  onClose: () => void;
}

export const SolutionViewerModal: React.FC<SolutionViewerModalProps> = ({ solution, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!solution) return null;

  const handleCopy = () => {
    const textToCopy = `Question:\n${solution.question}\n\nReference: ${solution.reference}\n\nSolution:\n${solution.solution_markdown}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="solution-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="solution-modal-header">
          <div className="solution-header-info">
            <div className="solution-tag-row">
              <span className="badge badge-primary">
                <Sparkles size={12} className="inline-icon" /> AI-Grounded Solution
              </span>
              <span className="badge badge-subtle">Unit {solution.unit}</span>
              <span className="badge badge-accent">{solution.exam}</span>
              <span className="badge badge-marks">
                <Award size={12} className="inline-icon" /> {solution.marks} Marks
              </span>
            </div>
            <h2 className="solution-modal-title">{solution.topic}</h2>
            <div className="solution-meta-sub">
              <span><strong>Subject Code:</strong> {solution.subject_code}</span>
              <span><strong>ID:</strong> {solution.question_id}</span>
              <span className="hash-tag">
                <Hash size={11} className="inline-icon" /> {solution.question_hash}
              </span>
            </div>
          </div>
          <button className="icon-button-close" onClick={onClose} title="Close (Esc)">
            <X size={20} />
          </button>
        </div>

        {/* Disclaimer Gate */}
        <div className="solution-disclaimer-banner">
          <AlertTriangle size={18} className="disclaimer-icon" />
          <div className="disclaimer-text">
            <strong>AI-Assisted Solution Review Gate:</strong> This solution is systematically derived using syllabus guidelines and textbook problem-solving structures. Always independently verify final formulas and numerical evaluations with your official course instructor and prescribed textbooks.
          </div>
        </div>

        {/* Modal Body */}
        <div className="solution-modal-body">
          {/* Question Box */}
          <div className="solution-question-box">
            <div className="question-box-header">
              <span>Exam Question</span>
              <span className="question-marks">{solution.marks} Marks</span>
            </div>
            <div className="question-box-content">
              <KaTeXRenderer content={solution.question} />
            </div>
          </div>

          {/* Reference Book Callout */}
          {solution.reference && (
            <div className="solution-reference-callout">
              <BookOpen size={16} className="ref-icon" />
              <div className="ref-content">
                <span className="ref-label">Prescribed Textbook Reference:</span>
                <span className="ref-text">{solution.reference}</span>
              </div>
            </div>
          )}

          {/* Solution Body */}
          <div className="solution-body-card">
            <div className="solution-body-header">
              <h3>Detailed Derivation & Solution</h3>
              <button className="copy-solution-btn" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check size={14} className="text-success" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Markdown
                  </>
                )}
              </button>
            </div>
            <div className="solution-markdown-body">
              <KaTeXRenderer content={solution.solution_markdown} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="solution-modal-footer">
          <div className="footer-left">
            <span className="footer-hint">Press <strong>Esc</strong> to return to materials</span>
          </div>
          <button className="btn-secondary" onClick={onClose}>
            Close Solution
          </button>
        </div>
      </div>
    </div>
  );
};
