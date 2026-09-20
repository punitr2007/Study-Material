import React from 'react';
import type { CategoryFilter } from '../types/catalog';

interface CategoryFilterProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
}

const CATEGORY_ITEMS: { key: CategoryFilter; label: string }[] = [
  { key: 'ALL', label: 'All Resources' },
  { key: 'Mid_Semester', label: '📝 Mid-Sem PYQs' },
  { key: 'End_Semester', label: '🎓 End-Sem PYQs' },
  { key: 'Practice_Material', label: '🎯 Practice Material & Problem Sets' },
  { key: 'Linear_Algebra_Done_Right', label: '📐 Linear Algebra Done Right (4th Ed)' },
  { key: 'downloaded_notes', label: '📖 Lecture Notes' },
  { key: 'Textbooks', label: '📚 Textbooks & References' },
  { key: 'Assignments', label: '📋 Assignments & Solutions' },
  { key: 'Summer_Semester', label: '☀️ Summer Exam' },
  { key: 'Lab_Manuals_and_Experiments', label: '🔬 Lab Manuals' },
  { key: 'Handwritten_Notes', label: '✍️ Handwritten Notes' },
  { key: 'Lecture_Slides', label: '🖥️ Lecture Slides' }
];

export const CategoryFilterBar: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory
}) => {
  return (
    <div className="category-pills">
      {CATEGORY_ITEMS.map((item) => {
        const isActive = activeCategory === item.key;
        return (
          <button
            key={item.key}
            className={`pill-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(item.key)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
