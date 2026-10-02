import React from 'react';
import { FolderArchive, Target, Sparkles, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import type { ActiveNavView } from './Navbar';

interface StudyHubViewProps {
  onNavigate: (view: ActiveNavView) => void;
  totalDocuments: number;
}

export const StudyHubView: React.FC<StudyHubViewProps> = ({ onNavigate, totalDocuments }) => {
  return (
    <div className="study-hub-container" style={{ padding: '24px 0', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            color: 'var(--accent-primary)',
            fontSize: '0.84rem',
            fontWeight: 700,
            marginBottom: '12px'
          }}
        >
          <Layers size={14} />
          <span>Academic Curriculum Hub</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
          Study & Exam Preparation
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
          Explore official semester course materials, rigorous international practice problem sets, and AI-assisted mathematical step-by-step derivations.
        </p>
      </div>

      {/* Touch-Friendly 3-Column Destination Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        {/* Card 1: University Materials */}
        <div
          onClick={() => onNavigate('materials')}
          className="study-hub-card"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                border: '1px solid rgba(99, 102, 241, 0.3)'
              }}
            >
              <FolderArchive size={26} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                University Materials
              </h2>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
              Complete 3rd Semester repository covering all 5 core subjects: Mid-Sem, End-Sem, and Summer PYQs, official handwritten notes, syllabus handbooks, and faculty slides.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>{totalDocuments} verified academic documents</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Year-by-year PYQ archives (2021–2024)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Fast in-browser CDN preview & download</span>
              </div>
            </div>
          </div>

          <button
            className="btn-preview"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '0.92rem'
            }}
          >
            <span>Browse Materials</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Card 2: Practice Vault */}
        <div
          onClick={() => onNavigate('practice')}
          className="study-hub-card"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <Target size={26} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Practice Vault
              </h2>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
              High-yield curated problem sets for deep conceptual mastery. Includes Sedra & Smith Microelectronics solutions, Stanford & Texas A&M problem sets, and Axler Linear Algebra proofs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Sedra & Smith 7th/8th Edition Chapter Problems</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Linear Algebra Done Right 4th Ed Solutions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Signals & Probability Problem Sets</span>
              </div>
            </div>
          </div>

          <button
            className="btn-preview"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '0.92rem'
            }}
          >
            <span>Open Practice Vault</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Card 3: AI Solutions */}
        <div
          onClick={() => onNavigate('solutions')}
          className="study-hub-card"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#ec4899',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                border: '1px solid rgba(236, 72, 153, 0.3)'
              }}
            >
              <Sparkles size={26} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                AI Solved Derivations
              </h2>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
              Detailed step-by-step mathematical breakdowns of tough PYQ questions, Fourier/Laplace transforms, Markov chains, CMOS gate sizing, and PCA eigenvalue derivations rendered with KaTeX.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>KaTeX mathematical typography</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Key takeaways & common exam traps</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Difficulty ratings & subject filtering</span>
              </div>
            </div>
          </div>

          <button
            className="btn-preview"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '0.92rem'
            }}
          >
            <span>Explore Solved Problems</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
