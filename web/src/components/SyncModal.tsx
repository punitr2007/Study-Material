import React, { useState } from 'react';
import { RefreshCw, Play, Key, ExternalLink, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshLocal: () => Promise<void>;
  isRefreshing: boolean;
  totalDocs: number;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  onRefreshLocal,
  isRefreshing,
  totalDocs
}) => {
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('study_material_gh_token') || '');
  const [triggerStatus, setTriggerStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleSaveToken = (val: string) => {
    setGithubToken(val);
    localStorage.setItem('study_material_gh_token', val);
  };

  const handleTriggerCloudSync = async () => {
    if (!githubToken.trim()) {
      setTriggerStatus('error');
      setStatusMessage('Please enter a GitHub Personal Access Token (with workflow/repo scope) to trigger cloud sync.');
      return;
    }

    setTriggerStatus('loading');
    setStatusMessage('Triggering GitHub Actions AutoSync pipeline...');

    try {
      const response = await fetch(
        'https://api.github.com/repos/punitr2007/Study-Material/actions/workflows/daily_sync.yml/dispatches',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${githubToken.trim()}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          },
          body: JSON.stringify({ ref: 'main' })
        }
      );

      if (response.ok || response.status === 204) {
        setTriggerStatus('success');
        setStatusMessage('Cloud AutoSync triggered successfully! GitHub Actions is now syncing Google Drive and updating Vercel.');
      } else {
        const errJson = await response.json().catch(() => ({}));
        setTriggerStatus('error');
        setStatusMessage(errJson.message || `GitHub API error (HTTP ${response.status})`);
      }
    } catch (err: any) {
      setTriggerStatus('error');
      setStatusMessage(err.message || 'Network error triggering cloud sync.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '620px', height: 'auto', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', width: '32px', height: '32px' }}>
              <RefreshCw size={18} />
            </div>
            <span className="modal-doc-title">Academic AutoSync & Live Refresh</span>
          </div>

          <button className="btn-icon" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Instant In-Browser Catalog Refresh */}
          <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>Instant In-App Refresh</span>
              </div>
              <span className="brand-badge">{totalDocs} Loaded</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
              Fetch the freshest catalog directly from CDN without reloading the webpage. Useful if new materials were just deployed.
            </p>
            <button
              className="btn-preview"
              style={{ width: '100%' }}
              onClick={onRefreshLocal}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={isRefreshing ? 'spin-animation' : ''} />
              <span>{isRefreshing ? 'Refreshing Catalog...' : 'Refresh Catalog Cache Now'}</span>
            </button>
          </div>

          {/* Card 2: Cloud AutoSync Trigger via GitHub Actions */}
          <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }}>
              <Play size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>Trigger Cloud AutoSync (Google Drive → GitHub → Vercel)</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
              Dispatches the <code>daily_sync.yml</code> GitHub Actions workflow to query Google Drive, slice new exam bundles with Tesseract OCR, and auto-deploy to Vercel.
            </p>

            {/* Token Input */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                <Key size={14} />
                <span>GitHub Token (Optional for 1-Click Trigger)</span>
              </label>
              <input
                type="password"
                className="search-input"
                style={{ padding: '10px 14px', fontSize: '0.85rem' }}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={githubToken}
                onChange={(e) => handleSaveToken(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-preview"
                style={{ background: 'var(--accent-emerald)', flex: 1 }}
                onClick={handleTriggerCloudSync}
                disabled={triggerStatus === 'loading'}
              >
                <Play size={16} />
                <span>{triggerStatus === 'loading' ? 'Dispatching...' : 'Trigger Cloud Sync'}</span>
              </button>

              <a
                href="https://github.com/punitr2007/Study-Material/actions/workflows/daily_sync.yml"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-github"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="Open GitHub Actions in New Tab"
              >
                <span>Actions Tab</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: triggerStatus === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                  color: triggerStatus === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                  border: `1px solid ${triggerStatus === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
                }}
              >
                {triggerStatus === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{statusMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
