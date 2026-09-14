import React from 'react';
import { FileText, BookMarked, GraduationCap, FolderKanban, Sparkles } from 'lucide-react';
import type { CatalogData } from '../types/catalog';

interface HeroProps {
  catalog: CatalogData;
}

export const Hero: React.FC<HeroProps> = ({ catalog }) => {
  const pyqCount = catalog.documents.filter(
    (d) =>
      d.category === 'downloaded_pyqs' ||
      d.category === 'Mid_Semester' ||
      d.category === 'End_Semester' ||
      d.category === 'Summer_Semester'
  ).length;

  const notesCount = catalog.documents.filter(
    (d) => d.category === 'downloaded_notes' || (d.sub_category && d.sub_category.startsWith('Unit_'))
  ).length;

  const textbooksCount = catalog.documents.filter((d) => d.category === 'Textbooks').length;

  return (
    <section className="hero-section">
      <div className="hero-pill">
        <Sparkles size={14} />
        <span>NSUT 3rd Semester Academic Hub</span>
      </div>

      <h1 className="hero-title">
        All Your Course Materials,
        <br />
        Organized & Searchable.
      </h1>

      <p className="hero-subtitle">
        Instant access to previous year question papers (Mid-Sem, End-Sem), unit lecture notes, verified
        textbooks, problem set tutorials, and lab manuals.
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
            <FolderKanban size={20} />
          </div>
          <div>
            <div className="stat-num">{catalog.total_subjects}</div>
            <div className="stat-label">Subjects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <div className="stat-num">{pyqCount}</div>
            <div className="stat-label">Exam PYQs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
            <FileText size={20} />
          </div>
          <div>
            <div className="stat-num">{notesCount}</div>
            <div className="stat-label">Lecture Notes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
            <BookMarked size={20} />
          </div>
          <div>
            <div className="stat-num">{textbooksCount}</div>
            <div className="stat-label">Textbooks</div>
          </div>
        </div>
      </div>
    </section>
  );
};
