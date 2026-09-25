import React, { useEffect, useState } from 'react';
import type { CatalogDocument } from '../types/catalog';
import { X, Download, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

interface PdfViewerModalProps {
  document: CatalogDocument | null;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ document, onClose }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [document, onClose]);

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
              title="Open in new tab"
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

        {/* Modal Body: Embedded PDF View with Graceful State */}
        <div className="modal-body" style={{ position: 'relative' }}>
          {isLoading && !hasError && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--text-muted)',
                zIndex: 1,
              }}
            >
              <RefreshCw size={20} className="spin-animation" style={{ color: 'var(--accent-primary)' }} />
              <span>Loading document stream...</span>
            </div>
          )}

          {hasError ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '40px 20px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              <AlertCircle size={40} style={{ color: 'var(--accent-primary)', marginBottom: '14px', opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                Direct Preview Unavailable in Embed Mode
              </h3>
              <p style={{ maxWidth: '420px', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                This file may have iframe restrictions. You can open it directly in a new tab or download it immediately.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a
                  href={document.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-github"
                  style={{ padding: '10px 18px' }}
                >
                  <ExternalLink size={16} />
                  <span>Open in Google Drive</span>
                </a>
                <a
                  href={document.download_url}
                  download={document.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-preview"
                  style={{ padding: '10px 18px' }}
                >
                  <Download size={16} />
                  <span>Direct Download</span>
                </a>
              </div>
            </div>
          ) : (
            <iframe
              src={document.preview_url}
              title={document.title}
              className="pdf-iframe"
              allow="fullscreen"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
