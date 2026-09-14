import React, { useEffect } from 'react';
import type { CatalogDocument } from '../types/catalog';
import { X, Download, ExternalLink } from 'lucide-react';

interface PdfViewerModalProps {
  document: CatalogDocument | null;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ document, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!document) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="tag-badge code">{document.subject_code}</span>
            <span className="modal-doc-title" title={document.title}>
              {document.title}
            </span>
            <span className="tag-badge category">{document.category_label}</span>
          </div>

          <div className="modal-actions">
            <a
              href={document.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              title="Open PDF in new tab"
            >
              <ExternalLink size={18} />
            </a>

            <a
              href={document.download_url}
              download={document.filename}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-github"
              style={{ padding: '6px 14px' }}
              title="Download File"
            >
              <Download size={16} />
              <span>Download</span>
            </a>

            <button className="btn-icon" onClick={onClose} title="Close Preview (Esc)">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body: Embedded PDF View via jsDelivr CDN */}
        <div className="modal-body">
          <iframe
            src={document.preview_url}
            title={document.title}
            className="pdf-iframe"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
};
