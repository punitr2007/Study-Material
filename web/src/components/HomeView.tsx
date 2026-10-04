import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Target,
  Globe,
  BarChart3,
  ArrowRight,
  Search,
  Cloud,
  Award,
  Zap,
  FolderArchive,
  ChevronRight
} from 'lucide-react';
import type { CatalogData } from '../types/catalog';
import type { ActiveNavView } from './Navbar';
import { useAuth } from '../context/AuthContext';

interface HomeViewProps {
  catalog: CatalogData;
  onNavigate: (view: ActiveNavView, search?: string) => void;
  onOpenAuthModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ catalog, onNavigate, onOpenAuthModal }) => {
  const { user, progress } = useAuth();
  const [localSearch, setLocalSearch] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      onNavigate('materials', localSearch.trim());
    } else {
      onNavigate('materials');
    }
  };

  // Find most recent quiz attempt if any
  const quizAttempts = Object.values(progress.nptelProgress || {});
  const mostRecentAttempt = quizAttempts.length > 0
    ? quizAttempts.sort((a, b) => new Date(b.lastCompletedAt).getTime() - new Date(a.lastCompletedAt).getTime())[0]
    : null;

  return (
    <div className="home-dashboard-container" style={{ padding: '16px 0 48px 0' }}>
      {/* Hero Welcome Banner */}
      <section
        className="home-hero"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(236, 72, 153, 0.05) 100%)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-2xl)',
          padding: '40px 32px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '820px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: 'var(--accent-primary)',
              fontSize: '0.84rem',
              fontWeight: 700,
              marginBottom: '16px'
            }}
          >
            <Zap size={14} />
            <span>NSUT 3rd Semester • Electronics & Communication Engineering</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 16px 0',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}
          >
            Comprehensive Academic Workspace & Intelligent Practice Portal
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: '0 0 28px 0',
              maxWidth: '720px'
            }}
          >
            Official university curriculum archives, 200 interactive NPTEL weekly MCQs, Sedra & Smith problem vaults, and AI-assisted KaTeX mathematical derivations in a unified high-performance interface.
          </p>

          {/* Quick-Launch Universal Search */}
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: '24px', maxWidth: '640px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-card)',
                border: '2px solid var(--accent-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: '6px 8px 6px 16px',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.18)'
              }}
            >
              <Search size={20} style={{ color: 'var(--accent-primary)', marginRight: '10px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search PYQs, subjects (e.g. EAEPC302), handbooks, or topics..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.96rem',
                  fontWeight: 500
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--accent-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  padding: '9px 18px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Search</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>

          {/* Quick Stats Pill Strip */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.84rem',
              color: 'var(--text-muted)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--bg-card)',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <FolderArchive size={15} style={{ color: 'var(--accent-primary)' }} />
              <strong style={{ color: 'var(--text-primary)' }}>{catalog.total_documents}</strong> Files
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--bg-card)',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <GraduationCap size={15} style={{ color: '#10b981' }} />
              <strong style={{ color: 'var(--text-primary)' }}>200</strong> NPTEL MCQs
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--bg-card)',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <BookOpen size={15} style={{ color: '#ec4899' }} />
              <strong style={{ color: 'var(--text-primary)' }}>5</strong> Core Subjects
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--bg-card)',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Globe size={15} style={{ color: '#3b82f6' }} />
              <strong style={{ color: 'var(--text-primary)' }}>24</strong> Drive Shards
            </div>
          </div>
        </div>
      </section>

      {/* Resume Learning or Cloud Sync Banner */}
      <section style={{ marginBottom: '32px' }}>
        {mostRecentAttempt ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              padding: '18px 24px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-xl)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Award size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.98rem' }}>
                  Resume Learning: NPTEL Week {mostRecentAttempt.week}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Highest Score: <strong>{mostRecentAttempt.highestScore}/{mostRecentAttempt.totalQuestions}</strong> ({mostRecentAttempt.percentage}%) • {mostRecentAttempt.attemptsCount} attempt{mostRecentAttempt.attemptsCount > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('quizzes')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              <span>Continue Quiz</span>
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              padding: '16px 22px',
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Cloud size={20} style={{ color: 'var(--accent-primary)' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  {user ? `Connected as ${user.displayName || user.email}` : 'Dual-Storage Cloud Sync Available'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {user
                    ? 'Your test scores, bookmarks, and flags sync atomically across devices.'
                    : 'Sign in with Google to preserve your quiz scores and bookmarks across laptop & phone.'}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAuthModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              <span>{user ? 'Manage Sync' : 'Sign in with Google'}</span>
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </section>

      {/* 3 Core Academic Pillars */}
      <section style={{ marginBottom: '36px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Core Academic Pillars
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
            Curated resources structured for both internal mid-terms and university end-semesters.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {/* Pillar 1: University Materials */}
          <div
            onClick={() => onNavigate('materials')}
            className="study-hub-card"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}
              >
                <FolderArchive size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                University Materials & PYQs
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                Complete syllabus for all 5 subjects: Signals & Systems, Probability & Random Process, Microelectronics, Digital Circuits, and Mathematics for ML.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>• Mid, End & Summer Sem PYQ Archives (2021–2024)</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>• Downloaded Unit notes & Handbooks</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>• Instant in-browser PDF previewer</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.88rem', gap: '6px' }}>
              <span>Explore Materials</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* Pillar 2: NPTEL Practice Hub */}
          <div
            onClick={() => onNavigate('quizzes')}
            className="study-hub-card"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}
              >
                <GraduationCap size={22} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  NPTEL Dedicated Portal
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontWeight: 700
                  }}
                >
                  Interactive
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                Developing Soft Skills & Personality (NPTEL109104107). 8 weeks of official slide summaries and 200 interactive MCQs.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>• Practice Mode with instant option feedback</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>• Exam Simulation with timer and report card</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>• Question flagging and week filter tabs</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontWeight: 700, fontSize: '0.88rem', gap: '6px' }}>
              <span>Launch Quiz Engine</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* Pillar 3: Practice Vault & AI Derivations */}
          <div
            onClick={() => onNavigate('practice')}
            className="study-hub-card"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(236, 72, 153, 0.15)',
                  color: '#ec4899',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}
              >
                <Target size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                Practice Vault & AI Derivations
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                Sedra & Smith Microelectronics solutions, Stanford & Texas A&M problem sets, and KaTeX mathematical breakdowns.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>• Axler Linear Algebra Done Right proofs</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>• Step-by-step solved Fourier & Laplace transforms</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>• CMOS sizing & circuit derivations</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', color: '#ec4899', fontWeight: 700, fontSize: '0.88rem', gap: '6px' }}>
              <span>Enter Practice Vault</span>
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem & Tools Quick Access */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Ecosystem & Intelligence Tools
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
            Advanced analytical tools to maximize exam preparedness.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          <div
            onClick={() => onNavigate('drive')}
            className="study-hub-card"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px 24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Globe size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800 }}>Drive Explorer</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Browse 884 documents across 24 subject code shards.
                </p>
              </div>
            </div>
            <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div
            onClick={() => onNavigate('analytics')}
            className="study-hub-card"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px 24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: '#a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <BarChart3 size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800 }}>Subject Analytics</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Unit topic frequency weights and recurring exam patterns.
                </p>
              </div>
            </div>
            <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </section>
    </div>
  );
};
