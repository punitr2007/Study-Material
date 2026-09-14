import React, { useState } from 'react';
import type { CatalogDocument } from '../types/catalog';
import { Eye, Download, Check, Share2 } from 'lucide-react';

interface DocumentCardProps {
  document: CatalogDocument;
  onPreview: (doc: CatalogDocument) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onPreview }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(document.download_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="doc-card" onClick={() => onPreview(document)} style={{ cursor: 'pointer' }}>
      <div>
        <div className="card-top">
          <div className="card-tags">
            <span className="tag-badge code">{document.subject_code}</span>
            {document.year && <span className="tag-badge year">{document.year}</span>}
            <span className="tag-badge category">{document.category_label}</span>
          </div>

          <div className="file-type-icon">{document.file_type}</div>
        </div>

        <h3 className="doc-title" title={document.filename}>
          {document.title}
        </h3>

        <div className="doc-meta">
          <span>{document.size_formatted}</span>
          <span>•</span>
          <span>{document.subject_name}</span>
        </div>
      </div>

      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn-preview"
          onClick={() => onPreview(document)}
          title="Open in in-browser PDF viewer"
        >
          <Eye size={16} />
          <span>View PDF</span>
        </button>

        <a
          href={document.download_url}
          download={document.filename}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-download"
          title="Direct Download"
        >
          <Download size={16} />
        </a>

        <button
          className="btn-download"
          onClick={handleCopyLink}
          title={copied ? 'Link Copied!' : 'Copy Direct Link'}
        >
          {copied ? <Check size={16} style={{ color: 'var(--accent-emerald)' }} /> : <Share2 size={16} />}
        </button>
      </div>
    </div>
  );
};
