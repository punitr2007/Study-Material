import React from 'react';
import { Tag } from 'lucide-react';

interface SubCategoryFilterProps {
  availableSubCategories: { key: string; label: string; count: number }[];
  selectedSubCategory: string; // 'ALL' or specific subcategory name
  onSelectSubCategory: (sub: string) => void;
}

export const SubCategoryFilterBar: React.FC<SubCategoryFilterProps> = ({
  availableSubCategories,
  selectedSubCategory,
  onSelectSubCategory,
}) => {
  if (availableSubCategories.length <= 1) return null;

  return (
    <div className="subcategory-filter-wrapper">
      <div className="subcategory-filter-label">
        <Tag size={13} className="inline-icon" />
        <span>Sub-Module:</span>
      </div>
      <div className="subcategory-pills-scroll">
        <button
          className={`subcat-pill-btn ${selectedSubCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => onSelectSubCategory('ALL')}
        >
          All Sections
        </button>
        {availableSubCategories.map((sub) => {
          const isActive = selectedSubCategory === sub.key;
          return (
            <button
              key={sub.key}
              className={`subcat-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectSubCategory(sub.key)}
            >
              <span>{sub.label}</span>
              <span className="subcat-count-badge">{sub.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
