import React from 'react';
import { Globe, BarChart3, ArrowRight, Wrench, CheckCircle2 } from 'lucide-react';
import type { ActiveNavView } from './Navbar';

interface ToolsHubViewProps {
  onNavigate: (view: ActiveNavView) => void;
}

export const ToolsHubView: React.FC<ToolsHubViewProps> = ({ onNavigate }) => {
  return (
    <div className="tools-hub-container" style={{ padding: '24px 0', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#3b82f6',
            fontSize: '0.84rem',
            fontWeight: 700,
            marginBottom: '12px'
          }}
        >
          <Wrench size={14} />
          <span>Ecosystem & Data Tools</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
          Academic Tools & Intelligence
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Explore distributed Google Drive shards across all 24 NSUT subject codes and analyze syllabus topic weightage trends.
        </p>
      </div>

      {/* 2-Column Touch-Friendly Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}
      >
        {/* Card 1: Drive Explorer */}
        <div
          onClick={() => onNavigate('drive')}
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
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              <Globe size={26} />
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
              Drive Explorer
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
              Access 24 complete subject code shards containing 884 verified documents indexed directly from NSUT Google Drive drives. Features branch-level filtering and search.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>24 Subject code shards</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>884 verified Drive documents</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Direct Drive links & in-browser previews</span>
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
            <span>Launch Drive Explorer</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Card 2: Subject Analytics */}
        <div
          onClick={() => onNavigate('analytics')}
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
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#a855f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                border: '1px solid rgba(168, 85, 247, 0.3)'
              }}
            >
              <BarChart3 size={26} />
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
              Subject Exam Analytics
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
              Data-driven exam insights: PYQ topic frequency distribution, unit-wise syllabus weightage scores, and high-yield recurring question analysis.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Unit-wise marks weighting distribution</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Frequent topic breakdown</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Smart exam preparation roadmap</span>
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
            <span>View Syllabus Analytics</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
