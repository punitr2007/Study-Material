import React from 'react';
import { Home, BookOpen, GraduationCap, Wrench } from 'lucide-react';
import type { ActiveNavView } from './Navbar';

interface MobileBottomNavProps {
  activeView: ActiveNavView;
  setActiveView: (view: ActiveNavView) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeView, setActiveView }) => {
  const isStudyActive = activeView === 'study-hub' || activeView === 'materials' || activeView === 'practice' || activeView === 'solutions';
  const isToolsActive = activeView === 'tools-hub' || activeView === 'drive' || activeView === 'analytics';

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {/* 1. Home */}
      <button
        className={`mobile-nav-item ${activeView === 'home' ? 'active' : ''}`}
        onClick={() => setActiveView('home')}
        aria-label="Home Dashboard"
      >
        <div className="mobile-nav-icon-wrap">
          <Home size={19} />
        </div>
        <span className="mobile-nav-label">Home</span>
      </button>

      {/* 2. Study (routes to Study Hub landing cards on touch) */}
      <button
        className={`mobile-nav-item ${isStudyActive ? 'active' : ''}`}
        onClick={() => {
          // If already in a study subview, tap goes to Study Hub cards overview
          if (activeView === 'materials' || activeView === 'practice' || activeView === 'solutions') {
            setActiveView('study-hub');
          } else {
            setActiveView('study-hub');
          }
        }}
        aria-label="Study & Curriculum Hub"
      >
        <div className="mobile-nav-icon-wrap">
          <BookOpen size={19} />
        </div>
        <span className="mobile-nav-label">Study</span>
      </button>

      {/* 3. NPTEL Portal */}
      <button
        className={`mobile-nav-item ${activeView === 'quizzes' ? 'active' : ''}`}
        onClick={() => setActiveView('quizzes')}
        aria-label="NPTEL Quiz Portal"
      >
        <div className="mobile-nav-icon-wrap">
          <GraduationCap size={19} />
        </div>
        <span className="mobile-nav-label">NPTEL</span>
      </button>

      {/* 4. Tools (routes to Tools Hub landing cards on touch) */}
      <button
        className={`mobile-nav-item ${isToolsActive ? 'active' : ''}`}
        onClick={() => {
          if (activeView === 'drive' || activeView === 'analytics') {
            setActiveView('tools-hub');
          } else {
            setActiveView('tools-hub');
          }
        }}
        aria-label="Tools & Data"
      >
        <div className="mobile-nav-icon-wrap">
          <Wrench size={19} />
        </div>
        <span className="mobile-nav-label">Tools</span>
      </button>
    </nav>
  );
};
