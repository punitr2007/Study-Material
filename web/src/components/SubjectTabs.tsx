import React from 'react';
import type { Subject } from '../types/catalog';
import { Layers } from 'lucide-react';

interface SubjectTabsProps {
  subjects: Subject[];
  selectedSubject: string; // 'ALL' or subject_id
  onSelectSubject: (id: string) => void;
  totalDocuments: number;
}

export const SubjectTabs: React.FC<SubjectTabsProps> = ({
  subjects,
  selectedSubject,
  onSelectSubject,
  totalDocuments
}) => {
  return (
    <div className="subject-tabs" role="tablist">
      <button
        role="tab"
        aria-selected={selectedSubject === 'ALL'}
        className={`tab-btn ${selectedSubject === 'ALL' ? 'active' : ''}`}
        onClick={() => onSelectSubject('ALL')}
      >
        <Layers size={16} />
        <span>All Subjects</span>
        <span className="tab-badge">{totalDocuments}</span>
      </button>

      {subjects.map((sub) => {
        const isActive = selectedSubject === sub.id;
        return (
          <button
            key={sub.id}
            role="tab"
            aria-selected={isActive}
            className={`tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelectSubject(sub.id)}
            title={sub.title}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{sub.code}</span>
            <span>{sub.name}</span>
            <span className="tab-badge">{sub.document_count}</span>
          </button>
        );
      })}
    </div>
  );
};
