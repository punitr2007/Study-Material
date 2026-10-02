import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Moon,
  Sun,
  RefreshCw,
  BarChart3,
  Sparkles,
  FolderArchive,
  Target,
  Globe,
  GraduationCap,
  Home,
  ChevronDown,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type ActiveNavView =
  | 'home'
  | 'study-hub'
  | 'materials'
  | 'practice'
  | 'solutions'
  | 'quizzes'
  | 'tools-hub'
  | 'drive'
  | 'analytics';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  totalDocuments: number;
  activeView: ActiveNavView;
  setActiveView: (view: ActiveNavView) => void;
  onOpenSyncModal: () => void;
  onOpenAuthModal: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  totalDocuments,
  activeView,
  setActiveView,
  onOpenSyncModal,
  onOpenAuthModal,
  isRefreshing,
}) => {
  const { user, syncState, lastSyncedAt } = useAuth();

  const [studyDropdownOpen, setStudyDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const studyDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (studyDropdownRef.current && !studyDropdownRef.current.contains(e.target as Node)) {
        setStudyDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns whenever active view changes
  useEffect(() => {
    setStudyDropdownOpen(false);
    setToolsDropdownOpen(false);
  }, [activeView]);

  const isStudyActive =
    activeView === 'study-hub' ||
    activeView === 'materials' ||
    activeView === 'practice' ||
    activeView === 'solutions';

  const isToolsActive =
    activeView === 'tools-hub' ||
    activeView === 'drive' ||
    activeView === 'analytics';

  const getSectionTitle = () => {
    switch (activeView) {
      case 'home': return 'Home';
      case 'materials': return 'Materials';
      case 'study-hub': return 'Study Hub';
      case 'practice': return 'Practice Vault';
      case 'solutions': return 'AI Solutions';
      case 'quizzes': return 'NPTEL Portal';
      case 'tools-hub': return 'Tools Hub';
      case 'drive': return 'Drive Explorer';
      case 'analytics': return 'Analytics';
      default: return 'NSUT Hub';
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-top-row">
          {/* Brand Group */}
          <a
            href="#"
            className="brand-group"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('home');
            }}
          >
            <div className="brand-icon-box">
              <BookOpen size={20} />
            </div>
            <div className="brand-title-wrap">
              <span className="brand-title">NSUT Hub</span>
              <span className="brand-badge">{totalDocuments} Files</span>
            </div>
          </a>

          {/* Active section chip for tablet/mobile */}
          <div className="nav-mobile-title-pill">
            <span>{getSectionTitle()}</span>
          </div>

          {/* Right Utility Cluster */}
          <div className="nav-actions">
            {/* Sync Status Button */}
            <button
              className="btn-github btn-nav-sync"
              onClick={onOpenSyncModal}
              title="AutoSync & Live Refresh"
              aria-label="Synchronize Data"
            >
              <RefreshCw
                size={15}
                className={isRefreshing || syncState === 'syncing' ? 'spin-animation' : ''}
                style={{ color: 'var(--accent-primary)' }}
              />
              <span className="nav-sync-text">
                {syncState === 'syncing' ? 'Syncing...' : 'Sync'}
              </span>
            </button>

            {/* Google Auth / Profile Button */}
            <button
              className="btn-nav-auth"
              onClick={onOpenAuthModal}
              title={user ? `Signed in as ${user.displayName || user.email}` : 'Sign in with Google'}
              aria-label="User Account and Cloud Sync"
            >
              <div className="auth-avatar-wrap">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Avatar'}
                    referrerPolicy="no-referrer"
                    className="auth-avatar-img"
                  />
                ) : (
                  <div className="auth-avatar-placeholder">
                    {user?.displayName ? (
                      user.displayName[0].toUpperCase()
                    ) : (
                      <UserIcon size={14} />
                    )}
                  </div>
                )}
                {/* Real-time Sync indicator dot */}
                <span
                  className={`auth-sync-dot ${
                    user
                      ? syncState === 'syncing'
                        ? 'dot-syncing'
                        : 'dot-synced'
                      : 'dot-guest'
                  }`}
                  title={
                    user
                      ? syncState === 'syncing'
                        ? 'Syncing with cloud...'
                        : `Synced (${lastSyncedAt || 'Active'})`
                      : 'Guest Mode (Saved locally)'
                  }
                />
              </div>
              <span className="nav-auth-label">
                {user ? user.displayName?.split(' ')[0] || 'Account' : 'Sign In'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              className="btn-icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* GitHub Repository */}
            <a
              href="https://github.com/punitr2007/Study-Material"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon nav-github-icon"
              title="GitHub Repository"
              aria-label="GitHub Repository"
            >
              <svg
                width="17"
                height="17"
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
            </a>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              className="btn-icon nav-hamburger-btn"
              onClick={() => setMobileDrawerOpen(true)}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Desktop Task-Based Hierarchy Navigation Bar */}
        <nav className="nav-view-tabs nav-task-hierarchy" aria-label="Main Navigation">
          {/* 1. Home */}
          <button
            className={`nav-tab-link ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => setActiveView('home')}
          >
            <Home size={15} className="inline-icon" />
            <span>Home</span>
          </button>

          {/* 2. Study Dropdown (Academic Curriculum) */}
          <div
            className={`nav-dropdown-wrap ${isStudyActive ? 'parent-active' : ''}`}
            ref={studyDropdownRef}
            onMouseEnter={() => setStudyDropdownOpen(true)}
            onMouseLeave={() => setStudyDropdownOpen(false)}
          >
            <button
              className={`nav-tab-link nav-dropdown-trigger ${isStudyActive ? 'active' : ''}`}
              onClick={() => setStudyDropdownOpen((prev) => !prev)}
              aria-expanded={studyDropdownOpen}
              aria-haspopup="true"
            >
              <BookOpen size={15} className="inline-icon" />
              <span>Study</span>
              <ChevronDown
                size={13}
                className={`dropdown-chevron ${studyDropdownOpen ? 'rotated' : ''}`}
              />
            </button>

            {studyDropdownOpen && (
              <div className="nav-dropdown-menu" role="menu">
                <button
                  role="menuitem"
                  className={`nav-dropdown-item ${activeView === 'materials' ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveView('materials');
                    setStudyDropdownOpen(false);
                  }}
                >
                  <FolderArchive size={16} className="dropdown-item-icon" />
                  <div className="dropdown-item-content">
                    <span className="dropdown-item-title">University Materials</span>
                    <span className="dropdown-item-desc">Core 5 Sem-3 Subjects, PYQ Archives & Handbooks</span>
                  </div>
                </button>

                <button
                  role="menuitem"
                  className={`nav-dropdown-item ${activeView === 'practice' ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveView('practice');
                    setStudyDropdownOpen(false);
                  }}
                >
                  <Target size={16} className="dropdown-item-icon" />
                  <div className="dropdown-item-content">
                    <span className="dropdown-item-title">Practice Vault</span>
                    <span className="dropdown-item-desc">Sedra & Smith, Stanford & Texas A&M Problems</span>
                  </div>
                </button>

                <button
                  role="menuitem"
                  className={`nav-dropdown-item ${activeView === 'solutions' ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveView('solutions');
                    setStudyDropdownOpen(false);
                  }}
                >
                  <Sparkles size={16} className="dropdown-item-icon" />
                  <div className="dropdown-item-content">
                    <span className="dropdown-item-title">AI Solved Derivations</span>
                    <span className="dropdown-item-desc">Step-by-step KaTeX mathematical breakdowns</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 3. NPTEL Portal (First-Class Destination) */}
          <button
            className={`nav-tab-link ${activeView === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveView('quizzes')}
          >
            <GraduationCap size={15} className="inline-icon" />
            <span>NPTEL Portal</span>
            <span className="nav-badge-pill">101 MCQs</span>
          </button>

          {/* 4. Tools Dropdown (Ecosystem & Data) */}
          <div
            className={`nav-dropdown-wrap ${isToolsActive ? 'parent-active' : ''}`}
            ref={toolsDropdownRef}
            onMouseEnter={() => setToolsDropdownOpen(true)}
            onMouseLeave={() => setToolsDropdownOpen(false)}
          >
            <button
              className={`nav-tab-link nav-dropdown-trigger ${isToolsActive ? 'active' : ''}`}
              onClick={() => setToolsDropdownOpen((prev) => !prev)}
              aria-expanded={toolsDropdownOpen}
              aria-haspopup="true"
            >
              <Globe size={15} className="inline-icon" />
              <span>Tools</span>
              <ChevronDown
                size={13}
                className={`dropdown-chevron ${toolsDropdownOpen ? 'rotated' : ''}`}
              />
            </button>

            {toolsDropdownOpen && (
              <div className="nav-dropdown-menu" role="menu">
                <button
                  role="menuitem"
                  className={`nav-dropdown-item ${activeView === 'drive' ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveView('drive');
                    setToolsDropdownOpen(false);
                  }}
                >
                  <Globe size={16} className="dropdown-item-icon" />
                  <div className="dropdown-item-content">
                    <span className="dropdown-item-title">Drive Explorer</span>
                    <span className="dropdown-item-desc">24 Subject Code Shards (884 verified documents)</span>
                  </div>
                </button>

                <button
                  role="menuitem"
                  className={`nav-dropdown-item ${activeView === 'analytics' ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveView('analytics');
                    setToolsDropdownOpen(false);
                  }}
                >
                  <BarChart3 size={16} className="dropdown-item-icon" />
                  <div className="dropdown-item-content">
                    <span className="dropdown-item-title">Subject Analytics</span>
                    <span className="dropdown-item-desc">PYQ trends, unit-wise topic weights & frequency</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Slide-over Mobile Drawer (< 768px) */}
      {mobileDrawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileDrawerOpen(false)}>
          <div
            className="mobile-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mobile-drawer-header">
              <div className="brand-group">
                <div className="brand-icon-box">
                  <BookOpen size={18} />
                </div>
                <span className="brand-title">NSUT Hub</span>
              </div>
              <button
                className="btn-icon"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile Banner in Drawer */}
            <div
              className="drawer-profile-box"
              onClick={() => {
                setMobileDrawerOpen(false);
                onOpenAuthModal();
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Avatar'}
                    referrerPolicy="no-referrer"
                    style={{ width: '38px', height: '38px', borderRadius: '50%' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'var(--accent-primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}
                  >
                    {user?.displayName ? user.displayName[0].toUpperCase() : <UserIcon size={16} />}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {user?.displayName || 'Guest Student'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {user ? 'Cloud Synced via Google' : 'Local Storage Mode • Tap to sign in'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mobile-drawer-links">
              <div className="drawer-group-label">Academic Destinations</div>
              <button
                className={`drawer-link ${activeView === 'home' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('home');
                  setMobileDrawerOpen(false);
                }}
              >
                <Home size={18} />
                <span>Home Dashboard</span>
              </button>

              <button
                className={`drawer-link ${activeView === 'materials' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('materials');
                  setMobileDrawerOpen(false);
                }}
              >
                <FolderArchive size={18} />
                <span>University Materials & PYQs</span>
              </button>

              <button
                className={`drawer-link ${activeView === 'quizzes' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('quizzes');
                  setMobileDrawerOpen(false);
                }}
              >
                <GraduationCap size={18} />
                <span>NPTEL Portal (101 MCQs)</span>
              </button>

              <button
                className={`drawer-link ${activeView === 'practice' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('practice');
                  setMobileDrawerOpen(false);
                }}
              >
                <Target size={18} />
                <span>Practice Vault (Problem Sets)</span>
              </button>

              <button
                className={`drawer-link ${activeView === 'solutions' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('solutions');
                  setMobileDrawerOpen(false);
                }}
              >
                <Sparkles size={18} />
                <span>AI Solved Derivations</span>
              </button>

              <div className="drawer-group-label" style={{ marginTop: '16px' }}>Ecosystem & Data</div>
              <button
                className={`drawer-link ${activeView === 'drive' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('drive');
                  setMobileDrawerOpen(false);
                }}
              >
                <Globe size={18} />
                <span>Drive Explorer (24 Shards)</span>
              </button>

              <button
                className={`drawer-link ${activeView === 'analytics' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('analytics');
                  setMobileDrawerOpen(false);
                }}
              >
                <BarChart3 size={18} />
                <span>Syllabus Exam Analytics</span>
              </button>
            </div>

            <div className="drawer-footer-actions">
              <button
                className="drawer-action-btn"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onOpenSyncModal();
                }}
              >
                <RefreshCw size={16} />
                <span>Sync & Refresh Data</span>
              </button>

              <button className="drawer-action-btn" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>

              <a
                href="https://github.com/punitr2007/Study-Material"
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-action-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
