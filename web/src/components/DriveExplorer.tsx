import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import {
  Search,
  FolderSync,
  ExternalLink,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { PdfViewerModal } from './PdfViewerModal';
import type { CatalogDocument } from '../types/catalog';

interface DriveDoc {
  id: string;
  title: string;
  filename: string;
  subject_code: string;
  code_aliases: string[];
  semester: string;
  branch: string;
  category: string;
  year?: string;
  preview_url: string;
  download_url: string;
  direct_url: string;
}

interface MasterManifest {
  version: string;
  generated_at: string;
  total_documents: number;
  semesters: Record<string, number>;
  subjects: Array<{
    code: string;
    name: string;
    aliases: string[];
    branch: string;
    semester: string;
    document_count: number;
  }>;
  shards: Record<string, string>;
}

const POPULAR_CODES = [
  'EAEPC304', 'ECECC304', 'EAEPC305', 'ECECC401', 'COCSC401',
  'CYC01', 'PHC01', 'MTC01', 'MTC02', 'ECC02', 'ECECC501'
];

export const DriveExplorer: React.FC = () => {
  const [manifest, setManifest] = useState<MasterManifest | null>(null);
  const [loadedShards, setLoadedShards] = useState<Record<string, DriveDoc[]>>({});
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<CatalogDocument | null>(null);

  // 1. Fetch Master Manifest on mount
  useEffect(() => {
    fetch('/drive_index/index_manifest.json')
      .then((res) => res.json())
      .then((data: MasterManifest) => {
        setManifest(data);
        // Preload sem1, sem2, sem3, sem4 shards initially
        const initialShards = ['sem1', 'sem2', 'sem3', 'sem4', 'general'];
        Promise.all(
          initialShards.map((sem) =>
            fetch(`/drive_index/${sem}.json`)
              .then((r) => r.json())
              .then((sData) => ({ sem, docs: sData.documents || [] }))
              .catch(() => ({ sem, docs: [] }))
          )
        ).then((results) => {
          const shardMap: Record<string, DriveDoc[]> = {};
          results.forEach(({ sem, docs }) => {
            shardMap[sem] = docs;
          });
          setLoadedShards(shardMap);
          setIsLoading(false);
        });
      })
      .catch((err) => {
        console.error('Failed to load drive manifest:', err);
        setIsLoading(false);
      });
  }, []);

  // 2. Lazy load shards when a specific semester is chosen
  const loadShardIfNeeded = async (sem: string) => {
    if (sem === 'all') {
      if (manifest?.shards) {
        const missing = Object.keys(manifest.shards).filter((k) => !loadedShards[k]);
        if (missing.length > 0) {
          const fetched = await Promise.all(
            missing.map((k) =>
              fetch(`/drive_index/${k}.json`)
                .then((r) => r.json())
                .then((sData) => ({ sem: k, docs: sData.documents || [] }))
                .catch(() => ({ sem: k, docs: [] }))
            )
          );
          setLoadedShards((prev) => {
            const next = { ...prev };
            fetched.forEach(({ sem: s, docs }) => {
              next[s] = docs;
            });
            return next;
          });
        }
      }
      return;
    }

    if (!loadedShards[sem]) {
      try {
        const res = await fetch(`/drive_index/${sem}.json`);
        const sData = await res.json();
        setLoadedShards((prev) => ({ ...prev, [sem]: sData.documents || [] }));
      } catch (err) {
        console.error(`Failed to load shard for ${sem}:`, err);
      }
    }
  };

  const handleSemesterChange = (sem: string) => {
    setSelectedSemester(sem);
    loadShardIfNeeded(sem);
  };

  // 3. Pool active documents from loaded shards
  const activeDocuments = useMemo(() => {
    if (selectedSemester === 'all') {
      return Object.values(loadedShards).flat();
    }
    return loadedShards[selectedSemester] || [];
  }, [loadedShards, selectedSemester]);

  // 4. Configure Fuse.js for fuzzy code and keyword matching
  const fuse = useMemo(() => {
    return new Fuse(activeDocuments, {
      keys: [
        { name: 'subject_code', weight: 0.4 },
        { name: 'code_aliases', weight: 0.3 },
        { name: 'title', weight: 0.2 },
        { name: 'branch', weight: 0.1 },
        { name: 'filename', weight: 0.1 },
      ],
      threshold: 0.35, // Allows typo tolerance e.g. ecec401 -> ECECC401
      ignoreLocation: true,
      useExtendedSearch: true,
    });
  }, [activeDocuments]);

  // 5. Filter & Fuse results
  const filteredDocuments = useMemo(() => {
    let list = activeDocuments;

    if (searchQuery.trim()) {
      const results = fuse.search(searchQuery.trim());
      list = results.map((r) => r.item);
    }

    if (selectedCategory !== 'all') {
      list = list.filter((doc) => doc.category === selectedCategory);
    }

    if (selectedBranch !== 'all') {
      list = list.filter((doc) => doc.branch.toLowerCase().includes(selectedBranch.toLowerCase()));
    }

    return list;
  }, [activeDocuments, searchQuery, fuse, selectedCategory, selectedBranch]);

  const handleQuickCodeClick = (code: string) => {
    setSearchQuery(code);
    loadShardIfNeeded('all');
  };

  const handleOpenPreview = (doc: DriveDoc) => {
    const converted: CatalogDocument = {
      id: doc.id,
      title: doc.title,
      filename: doc.filename,
      category: doc.category,
      category_label: doc.category.replace(/_/g, ' '),
      subject_id: `sem_${doc.semester}_${doc.subject_code}`,
      subject_code: doc.subject_code,
      subject_name: doc.branch,
      relative_path: doc.filename,
      size_bytes: 500000,
      size_formatted: 'PDF',
      file_type: 'pdf',
      preview_url: doc.preview_url,
      download_url: doc.download_url,
      year: doc.year ? String(doc.year) : undefined,
    };
    setSelectedDocForPreview(converted);
  };

  const handleOpenLiveDriveSearch = () => {
    const term = searchQuery.trim() || 'Question Papers';
    const driveSearchUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent(term)}`;
    window.open(driveSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="practice-vault-container">
      {/* Header Banner */}
      <div className="practice-header" style={{ marginBottom: '24px' }}>
        <div className="practice-header-badge">
          <Globe size={14} />
          <span>Universal Drive Explorer & Multi-Semester Index</span>
        </div>
        <h1 className="practice-title">On-Demand Subject Code & Drive Fetcher</h1>
        <p className="practice-subtitle">
          Search and stream question papers, books, and resources for <strong>all 8 Semesters & Branches</strong> directly from NSUT's public Google Drive archives without consuming local disk space.
        </p>
      </div>

      {/* Quick Search & Filter Controls */}
      <div className="practice-filters-panel" style={{ padding: '20px', borderRadius: '16px', marginBottom: '28px' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="filter-search-input"
            style={{
              paddingLeft: '44px',
              height: '46px',
              fontSize: '0.95rem',
              borderRadius: '12px',
            }}
            placeholder="Enter any Course Code or Subject Name (e.g. ECECC401, CYC01, Operating Systems, EAEPC304)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Popular Codes Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Quick Subject Suggestions:
          </span>
          {POPULAR_CODES.map((code) => (
            <button
              key={code}
              className={`filter-chip ${searchQuery === code ? 'active' : ''}`}
              onClick={() => handleQuickCodeClick(code)}
              style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '8px' }}
            >
              {code}
            </button>
          ))}
        </div>

        {/* Multi-Row Filter Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Semester Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '80px', fontWeight: 600 }}>
              Semester:
            </span>
            {['all', 'sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8', 'general'].map((sem) => (
              <button
                key={sem}
                className={`filter-chip ${selectedSemester === sem ? 'active' : ''}`}
                onClick={() => handleSemesterChange(sem)}
                style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}
              >
                {sem === 'all' ? 'All Semesters' : sem.replace('sem', 'Sem ')}
                {manifest?.semesters?.[sem] ? ` (${manifest.semesters[sem]})` : ''}
              </button>
            ))}
          </div>

          {/* Exam / Document Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '80px', fontWeight: 600 }}>
              Category:
            </span>
            {[
              { id: 'all', label: 'All Documents' },
              { id: 'Mid_Semester', label: 'Mid-Semester PYQs' },
              { id: 'End_Semester', label: 'End-Semester PYQs' },
              { id: 'Summer_Semester', label: 'Summer Backlog' },
              { id: 'Notes', label: 'Notes & Tutorials' },
              { id: 'Textbooks', label: 'Textbooks' },
            ].map((cat) => (
              <button
                key={cat.id}
                className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ fontSize: '0.8rem' }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Branch Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '80px', fontWeight: 600 }}>
              Branch:
            </span>
            {['all', 'ECE', 'ECAM', 'CSE', 'IT', 'EE', 'ICE', 'VLSI', 'Mathematics'].map((br) => (
              <button
                key={br}
                className={`filter-chip ${selectedBranch === br ? 'active' : ''}`}
                onClick={() => setSelectedBranch(br)}
                style={{ fontSize: '0.8rem' }}
              >
                {br === 'all' ? 'All Branches' : br}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header & Live Search Fallback Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          Found <span style={{ color: 'var(--accent-primary)' }}>{filteredDocuments.length}</span> resources across Drive Index
        </div>

        {/* Option B Live Search Fallback Trigger */}
        <button
          className="btn-github"
          onClick={handleOpenLiveDriveSearch}
          style={{ padding: '8px 14px', fontSize: '0.82rem', borderColor: 'var(--accent-primary)' }}
          title="Query Google Drive live in case a paper was just uploaded 5 minutes ago"
        >
          <FolderSync size={15} style={{ color: 'var(--accent-primary)' }} />
          <span>Search Drive Live (Option B Fallback)</span>
          <ExternalLink size={13} style={{ opacity: 0.7 }} />
        </button>
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="spin-animation" style={{ marginBottom: '12px', color: 'var(--accent-primary)' }} />
          <div>Loading sharded Drive catalog...</div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: 'var(--surface-color)',
            border: '1px dashed var(--border-color)',
            borderRadius: '16px',
          }}
        >
          <AlertCircle size={36} style={{ color: 'var(--accent-primary)', marginBottom: '12px', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>No exact match found in pre-indexed shards</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '500px', margin: '0 auto 18px auto' }}>
            The document might have been recently uploaded to the university Google Drive or uses a different code variant.
          </p>
          <button className="btn-github" onClick={handleOpenLiveDriveSearch} style={{ padding: '10px 20px' }}>
            <FolderSync size={16} />
            <span>Search Live University Google Drive Folder</span>
            <ExternalLink size={14} />
          </button>
        </div>
      ) : (
        <div className="practice-modules-grid">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="practice-module-card">
              <div className="practice-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="tag-badge code">{doc.subject_code}</span>
                  <span className="tag-badge category" style={{ textTransform: 'capitalize' }}>
                    {doc.semester.replace('sem', 'Sem ')}
                  </span>
                  {doc.year && <span className="tag-badge year">{doc.year}</span>}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                  title="Health-checked Google Drive source"
                >
                  <CheckCircle2 size={12} />
                  <span>Drive Verified</span>
                </div>
              </div>

              <h3 className="practice-card-title" title={doc.title}>
                {doc.title}
              </h3>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <span style={{ fontWeight: 500 }}>{doc.branch}</span>
                {doc.code_aliases.length > 1 && (
                  <div style={{ fontSize: '0.72rem', marginTop: '4px', opacity: 0.8 }}>
                    Aliases: {doc.code_aliases.join(', ')}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="practice-card-footer" style={{ marginTop: 'auto', gap: '8px' }}>
                <button
                  className="practice-btn-primary"
                  onClick={() => handleOpenPreview(doc)}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}
                >
                  <Eye size={15} />
                  <span>Preview</span>
                </button>

                <a
                  href={doc.download_url}
                  download={doc.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="practice-btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                  title="Direct Download from Drive"
                >
                  <Download size={15} />
                </a>

                <a
                  href={doc.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="practice-btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                  title="Open in Google Drive"
                >
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Preview */}
      {selectedDocForPreview && (
        <PdfViewerModal
          document={selectedDocForPreview}
          onClose={() => setSelectedDocForPreview(null)}
        />
      )}
    </div>
  );
};
