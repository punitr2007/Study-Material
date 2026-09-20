import React from 'react';
import type { CategoryFilter } from '../types/catalog';

interface CategoryFilterProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  categoryCounts?: Record<string, number>;
  totalDocuments?: number;
}

const CATEGORY_ITEMS: { key: CategoryFilter; label: string }[] = [
  { key: 'ALL', label: 'All Resources' },
  { key: 'Mid_Semester', label: '📝 Mid-Sem PYQs' },
  { key: 'End_Semester', label: '🎓 End-Sem PYQs' },
  { key: 'Practice_Material', label: '🎯 Practice Material & Problem Sets' },
  { key: 'Linear_Algebra_Done_Right', label: '📐 Linear Algebra Done Right (4th Ed)' },
  { key: 'downloaded_notes', label: '📖 Lecture Notes' },
  { key: 'Textbooks', label: '📚 Textbooks & References' },
  { key: 'Assignments', label: '📋 Assignments & Tutorials' },
  { key: 'Summer_Semester', label: '☀️ Summer Exam' },
  { key: 'Lab_Manuals_and_Experiments', label: '🔬 Lab Manuals' },
  { key: 'Handwritten_Notes', label: '✍️ Handwritten Notes' },
  { key: 'Lecture_Slides', label: '🖥️ Lecture Slides' }
];

export const CategoryFilterBar: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts = {},
  totalDocuments = 0
}) => {
  // Intelligently filter out categories with 0 documents for the current context
  const visibleCategories = CATEGORY_ITEMS.filter((item) => {
    if (item.key === 'ALL') return true;
    const count = categoryCounts[item.key] || 0;
    return count > 0;
  });

  return (
    <div className="category-pills">
      {visibleCategories.map((item) => {
        const isActive = activeCategory === item.key;
        const count = item.key === 'ALL' ? totalDocuments : categoryCounts[item.key];
        
        return (
          <button
            key={item.key}
            className={`pill-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(item.key)}
          >
            <span>{item.label}</span>
            {count !== undefined && count > 0 && (
              <span className="pill-badge">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
