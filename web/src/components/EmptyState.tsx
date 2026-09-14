import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="empty-state">
      <SearchX className="empty-icon" />
      <h3 className="empty-title">No matching documents found</h3>
      <p className="empty-desc">
        Try adjusting your search query, selecting a different subject, or clearing active category filters.
      </p>
      <button
        className="btn-preview"
        style={{ marginTop: '16px', display: 'inline-flex' }}
        onClick={onClearFilters}
      >
        Reset Filters
      </button>
    </div>
  );
};
