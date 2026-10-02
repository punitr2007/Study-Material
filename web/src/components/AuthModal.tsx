import React, { useState } from 'react';
import { X, Cloud, ShieldCheck, LogOut, Trash2, RefreshCw, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    progress,
    syncState,
    lastSyncedAt,
    loginWithGoogle,
    continueAsGuest,
    logout,
    deleteAccountData,
    triggerManualSync
  } = useAuth();

  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google Sign-In was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteAccountData();
      setIsDeleting(false);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to delete account data.');
    } finally {
      setLoading(false);
    }
  };

  const totalQuizzesTaken = Object.keys(progress.nptelProgress || {}).length;
  const totalFlags = (progress.flaggedQuestionIds || []).length;
  const totalBookmarks = (progress.bookmarkedDocIds || []).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content auth-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', padding: '28px' }}
      >
        <div className="modal-header" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(99, 102, 241, 0.4)'
              }}
            >
              <ShieldCheck size={20} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                {user ? 'Account & Academic Cloud' : 'Sign in to NSUT Hub'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {user ? 'Cross-device persistent state' : 'Seamless dual-storage sync & progress saving'}
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '0.85rem',
              marginBottom: '16px'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Not Signed In View */}
        {!user && (
          <div>
            <div
              style={{
                background: 'var(--bg-card-subtle)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Cloud size={18} style={{ color: 'var(--accent-primary)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Deterministic Multi-Device Sync</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Merge offline guest quizzes and bookmarked materials seamlessly with your Google Account without data loss.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Award size={18} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Quiz & Score Protection</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Preserve your highest test scores across Week 1–8 NPTEL assignments and question reviews.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <ShieldCheck size={18} style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Strict Privacy & DPDP Safe</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Zero advertising, zero analytics trackers on your answers, with user data isolation.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-google-auth"
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: '#1f2937',
                  border: '1px solid #d1d5db',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: loading ? 'wait' : 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{loading ? 'Connecting Google Account...' : 'Continue with Google'}</span>
              </button>

              <button
                className="btn-guest-continue"
                onClick={() => {
                  continueAsGuest();
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Continue as Guest (Save locally on this device)
              </button>
            </div>
          </div>
        )}

        {/* Signed In View */}
        {user && (
          <div>
            {/* User Profile Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                borderRadius: '12px',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px'
              }}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--accent-primary)'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '1.2rem',
                    fontWeight: 700
                  }}
                >
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {user.displayName || 'Academic Scholar'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email || 'Authenticated via Google'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: syncState === 'syncing' ? '#f59e0b' : '#10b981'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {syncState === 'syncing'
                      ? 'Syncing changes...'
                      : lastSyncedAt
                      ? `Cloud Synced (${lastSyncedAt})`
                      : 'Cloud Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Activity Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  padding: '12px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}
              >
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {totalQuizzesTaken}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Weeks Quizzed</div>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  padding: '12px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}
              >
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
                  {totalFlags}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Flagged MCQs</div>
              </div>

              <div
                style={{
                  background: 'rgba(236, 72, 153, 0.08)',
                  padding: '12px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid rgba(236, 72, 153, 0.2)'
                }}
              >
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ec4899' }}>
                  {totalBookmarks}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bookmarks</div>
              </div>
            </div>

            {/* Actions */}
            {!isDeleting ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  className="btn-preview"
                  onClick={triggerManualSync}
                  disabled={syncState === 'syncing'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 700
                  }}
                >
                  <RefreshCw size={16} className={syncState === 'syncing' ? 'spin-animation' : ''} />
                  <span>{syncState === 'syncing' ? 'Syncing...' : 'Sync Cloud Progress Now'}</span>
                </button>

                <button
                  onClick={logout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>

                <button
                  onClick={() => setIsDeleting(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    marginTop: '8px',
                    padding: '6px'
                  }}
                >
                  <Trash2 size={14} />
                  <span>Clear Local Progress & Manage Data Rights (DPDP)</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '14px',
                  borderRadius: '10px'
                }}
              >
                <div style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.9rem', marginBottom: '6px' }}>
                  Reset Progress & Erase Local State?
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  This clears your locally cached test attempts and signs you out. To permanently delete all cloud records in adherence with India's DPDP Act, your account session will be disconnected.
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setIsDeleting(false)}
                    style={{
                      padding: '8px 14px',
                      background: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
