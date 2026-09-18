import React from 'react';
import { Calendar } from 'lucide-react';

interface YearFilterProps {
  availableYears: string[];
  selectedYear: string;
  onSelectYear: (year: string) => void;
  yearCounts?: Record<string, number>;
}

export const YearFilterBar: React.FC<YearFilterProps> = ({
  availableYears,
  selectedYear,
  onSelectYear,
  yearCounts = {},
}) => {
  if (availableYears.length === 0) return null;

  return (
    <div className="year-filter-wrapper">
      <div className="year-filter-label">
        <Calendar size={14} className="inline-icon" />
        <span>Exam Year:</span>
      </div>
      <div className="year-pills-scroll">
        <button
          className={`year-pill-btn ${selectedYear === 'ALL' ? 'active' : ''}`}
          onClick={() => onSelectYear('ALL')}
        >
          All Years
        </button>
        {availableYears.map((yr) => {
          const isActive = selectedYear === yr;
          const count = yearCounts[yr];
          return (
            <button
              key={yr}
              className={`year-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectYear(yr)}
            >
              <span>{yr}</span>
              {count !== undefined && <span className="year-count-badge">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
