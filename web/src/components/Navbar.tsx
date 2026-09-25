import React from 'react';
import { BookOpen, Moon, Sun, ExternalLink, RefreshCw, BarChart3, Sparkles, FolderArchive, Target, Globe } from 'lucide-react';

export type ActiveNavView = 'materials' | 'practice' | 'drive' | 'analytics' | 'solutions';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  totalDocuments: number;
  activeView: ActiveNavView;
  setActiveView: (view: ActiveNavView) => void;
  onOpenSyncModal: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  totalDocuments,
  activeView,
  setActiveView,
  onOpenSyncModal,
  isRefreshing,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <a href="#" className="brand-group" onClick={(e) => { e.preventDefault(); setActiveView('materials'); }}>
          <div className="brand-icon-box">
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-title">NSUT Study Material</span>
              <span className="brand-badge">{totalDocuments} Files</span>
            </div>
          </div>
        </a>

        {/* View Switcher Tabs */}
        <nav className="nav-view-tabs">
          <button
            className={`nav-tab-link ${activeView === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveView('materials')}
          >
            <FolderArchive size={15} className="inline-icon" />
            <span>Materials</span>
          </button>
          <button
            className={`nav-tab-link ${activeView === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveView('practice')}
          >
            <Target size={15} className="inline-icon" />
            <span>Practice Vault</span>
          </button>
          <button
            className={`nav-tab-link ${activeView === 'drive' ? 'active' : ''}`}
            onClick={() => setActiveView('drive')}
          >
            <Globe size={15} className="inline-icon" />
            <span>Drive Explorer</span>
          </button>
          <button
            className={`nav-tab-link ${activeView === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveView('analytics')}
          >
            <BarChart3 size={15} className="inline-icon" />
            <span>Analytics</span>
          </button>
          <button
            className={`nav-tab-link ${activeView === 'solutions' ? 'active' : ''}`}
            onClick={() => setActiveView('solutions')}
          >
            <Sparkles size={15} className="inline-icon" />
            <span>AI Solutions</span>
          </button>
        </nav>
      </div>

      <div className="nav-actions">
        <button
          className="btn-github"
          onClick={onOpenSyncModal}
          style={{ padding: '7px 12px', fontSize: '0.82rem' }}
          title="AutoSync & Live Refresh"
        >
          <RefreshCw
            size={15}
            className={isRefreshing ? 'spin-animation' : ''}
            style={{ color: 'var(--accent-primary)' }}
          />
          <span className="nav-sync-text">Sync & Refresh</span>
        </button>

        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <a
          href="https://github.com/punitr2007/Study-Material"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-github nav-github-link"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          <span>GitHub</span>
          <ExternalLink size={14} style={{ opacity: 0.6 }} />
        </a>
      </div>
    </header>
  );
};
