import React, { useState, useMemo } from 'react';
import type { CatalogDocument } from '../types/catalog';
import { 
  Target, 
  BookOpen, 
  GraduationCap, 
  Search, 
  Download, 
  Eye, 
  Sparkles, 
  Check, 
  Share2, 
  BookMarked,
  Library,
  Layers,
  School
} from 'lucide-react';

interface PracticeVaultViewProps {
  documents: CatalogDocument[];
  onPreview: (doc: CatalogDocument) => void;
}

type PracticeSubFilter = 
  | 'ALL' 
  | 'SEDRA_SMITH'
  | 'ECE321_ARCHIVE'
  | 'ANALOG_GUIDES'
  | 'STANFORD_CME106'
  | 'PROBABILITY_UNITS'
  | 'ECEN303_TAMU'
  | 'LADR' 
  | 'TEXTBOOKS'
  | 'SOLUTIONS_MANUALS'
  | 'SCHAUMS'
  | 'EPMTC_MAPPED' 
  | 'MIT_OCW' 
  | 'MIAMI_MTH210' 
  | 'PROOF_BANK';

interface ModuleBadge {
  id: PracticeSubFilter;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const MODULES: ModuleBadge[] = [
  { 
    id: 'ALL', 
    label: 'All Practice & References', 
    icon: <Layers size={16} />,
    description: 'Complete collection of practice sheets, standard textbooks, solution manuals, and university problem archives.'
  },
  { 
    id: 'SEDRA_SMITH', 
    label: 'Sedra & Smith Solutions & Notes', 
    icon: <BookMarked size={16} />,
    description: 'Sedra & Smith Microelectronic Circuits complete solutions manual and Kevin Wang LaTeX chapter-by-chapter derivation notes.'
  },
  { 
    id: 'ECE321_ARCHIVE', 
    label: 'ECE 321 Microelectronics Archive', 
    icon: <School size={16} />,
    description: '28 Microelectronics lecture slide decks, 12 problem sets with step-by-step solutions, and midterm/final exam question archives.'
  },
  { 
    id: 'ANALOG_GUIDES', 
    label: 'Analog IC Design Guides', 
    icon: <Sparkles size={16} />,
    description: 'Practical guides covering Current Mirrors, Cascodes, Diff Pairs, Frequency Response, PLLs, ADCs, and LDOs.'
  },
  { 
    id: 'STANFORD_CME106', 
    label: 'Stanford CME 106 Cheatsheets', 
    icon: <Sparkles size={16} />,
    description: 'Crisp probability & statistical inference summary sheets by Shervine & Afshine Amidi (Stanford University).'
  },
  { 
    id: 'PROBABILITY_UNITS', 
    label: 'PTRP Unit 1-3 Mapped Worksheets', 
    icon: <Target size={16} />,
    description: 'Characteristic functions, Multivariate Gaussian, Transformations of RVs (Jacobians), and Chebyshev/Chernoff bounds.'
  },
  { 
    id: 'ECEN303_TAMU', 
    label: 'Texas A&M ECEN 303 Problem Sets', 
    icon: <School size={16} />,
    description: 'Engineering probability problem sets (1-10) and midterm exams from Texas A&M ECE Department.'
  },
  { 
    id: 'LADR', 
    label: 'Linear Algebra Done Right (4th Ed)', 
    icon: <BookMarked size={16} />,
    description: 'Sheldon Axler 4th Edition comprehensive solution manual with chapter-by-chapter proofs and master PDF.'
  },
  { 
    id: 'TEXTBOOKS', 
    label: 'Standard Reference Textbooks', 
    icon: <Library size={16} />,
    description: 'Sedra & Smith, Razavi, Boylestad, Yates & Goodman, Alexander & Sadiku, Stewart, Thomas Calculus, Oppenheim, etc.'
  },
  { 
    id: 'SOLUTIONS_MANUALS', 
    label: 'Official Solution Manuals', 
    icon: <Sparkles size={16} />,
    description: 'Complete verified solution manuals for Sedra & Smith, Oppenheim, Yates & Goodman PTRP, Walpole & Myers, Thomas Calculus 13th, etc.'
  },
  { 
    id: 'SCHAUMS', 
    label: "Schaum's Outlines & 3,000 Solved", 
    icon: <Target size={16} />,
    description: "Schaum's 3,000 Solved Problems in Calculus, 3,000 Solved Problems in Physics, Differential Equations, and Probability & Statistics."
  },
  { 
    id: 'EPMTC_MAPPED', 
    label: 'EPMTC301 Syllabus Mapped', 
    icon: <Target size={16} />,
    description: 'Custom problem sheets mapped directly to Course Outcomes: Subspaces, Linear Maps, & Inner Products.'
  },
  { 
    id: 'MIT_OCW', 
    label: 'MIT OCW 18.06 (Gilbert Strang)', 
    icon: <School size={16} />,
    description: 'Exams, problem sets, and verified solutions from MIT 18.06 Linear Algebra course.'
  },
  { 
    id: 'MIAMI_MTH210', 
    label: 'Miami MTH 210 Archive', 
    icon: <GraduationCap size={16} />,
    description: 'University quizzes, assignments, midterm exams, and final exams with detailed rubrics.'
  },
  { 
    id: 'PROOF_BANK', 
    label: 'Abstract Proofs & Worksheets', 
    icon: <Sparkles size={16} />,
    description: 'Exotic vector spaces, prove/disprove subspaces, Wronskians, and kernel/image derivations.'
  },
];

export const PracticeVaultView: React.FC<PracticeVaultViewProps> = ({
  documents,
  onPreview,
}) => {
  const [selectedModule, setSelectedModule] = useState<PracticeSubFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter practice and textbook documents
  const practiceDocs = useMemo(() => {
    return documents.filter((doc) => {
      const cat = doc.category.toLowerCase();
      const path = doc.relative_path.toLowerCase();
      return (
        cat.includes('practice') || 
        cat.includes('linear_algebra_done_right') || 
        cat.includes('textbook') ||
        cat.includes('assignment') ||
        path.includes('practice_and_reference_material') ||
        path.includes('practice_material') ||
        path.includes('linear_algebra_done_right') ||
        path.includes('textbooks') ||
        path.includes('assignments')
      );
    });
  }, [documents]);

  // Apply module & search filter
  const filteredDocs = useMemo(() => {
    return practiceDocs.filter((doc) => {
      const path = doc.relative_path.toLowerCase();
      const title = doc.title.toLowerCase();
      const filename = doc.filename.toLowerCase();
      const subCat = (doc.sub_category || '').toLowerCase();

      // Module match
      let matchesModule = true;
      if (selectedModule === 'SEDRA_SMITH') {
        matchesModule = path.includes('sedra') || filename.includes('sedra') || subCat.includes('sedra');
      } else if (selectedModule === 'ECE321_ARCHIVE') {
        matchesModule = path.includes('ece321') || filename.includes('ece321') || subCat.includes('ece 321');
      } else if (selectedModule === 'ANALOG_GUIDES') {
        matchesModule = path.includes('analog_design_basics') || subCat.includes('analog ic design');
      } else if (selectedModule === 'STANFORD_CME106') {
        matchesModule = path.includes('stanford') || subCat.includes('stanford');
      } else if (selectedModule === 'PROBABILITY_UNITS') {
        matchesModule = path.includes('unit_1_probability') || path.includes('unit_2_joint') || path.includes('unit_3_transformations') ||
                        subCat.includes('probability & rvs') || subCat.includes('joint rvs') || subCat.includes('transformations');
      } else if (selectedModule === 'ECEN303_TAMU') {
        matchesModule = path.includes('ecen303') || filename.includes('ecen303') || subCat.includes('ecen303');
      } else if (selectedModule === 'LADR') {
        matchesModule = path.includes('linear_algebra_done_right') || filename.includes('ladr');
      } else if (selectedModule === 'EPMTC_MAPPED') {
        matchesModule = path.includes('epmtc301_matching') || path.includes('unit_1_linear_algebra') || path.includes('unit_2_matrix_theory');
      } else if (selectedModule === 'MIT_OCW') {
        matchesModule = path.includes('mit_ocw') || path.includes('18.06');
      } else if (selectedModule === 'MIAMI_MTH210') {
        matchesModule = path.includes('miami_mth210') || path.includes('mth210');
      } else if (selectedModule === 'PROOF_BANK') {
        matchesModule = path.includes('abstract_proof') || path.includes('proof_based');
      } else if (selectedModule === 'TEXTBOOKS') {
        matchesModule = (path.includes('textbooks') || doc.category.toLowerCase().includes('textbook')) && 
                        !filename.includes('solution') && !filename.includes('solutions_manual');
      } else if (selectedModule === 'SOLUTIONS_MANUALS') {
        matchesModule = filename.includes('solution') || filename.includes('solutions_manual') || subCat.includes('solution');
      } else if (selectedModule === 'SCHAUMS') {
        matchesModule = filename.includes('schaum') || title.includes("schaum") || subCat.includes('schaum');
      }

      if (!matchesModule) return false;

      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          title.includes(query) || 
          filename.includes(query) || 
          doc.category_label.toLowerCase().includes(query) ||
          path.includes(query);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [practiceDocs, selectedModule, searchQuery]);

  // Master LADR PDF doc if available
  const masterLadrDoc = useMemo(() => {
    return documents.find((d) => 
      d.filename.includes('Linear_Algebra_Done_Right_4th_Edition_Complete_Solutions')
    );
  }, [documents]);

  const handleCopyLink = (doc: CatalogDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(doc.download_url);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="practice-vault-container" style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Hero Showcase Banner */}
      <div className="practice-hero-banner">
        <div className="practice-hero-content">
          <div className="practice-badge">
            <Sparkles size={14} />
            <span>Mathematics Resource Vault</span>
          </div>
          <h2 className="practice-hero-title">
            Practice Materials & Global Problem Archives
          </h2>
          <p className="practice-hero-desc">
            A curated collection of step-by-step textbook solutions, MIT OCW 18.06 problem sets, Miami MTH210 exam archives, EPMTC301 syllabus-aligned problem sheets, and reference textbooks.
          </p>

          <div className="practice-hero-stats">
            <div className="practice-stat-pill">
              <strong>{practiceDocs.length}</strong> Curated Documents
            </div>
            <div className="practice-stat-pill">
              <strong>9</strong> LADR 4th Ed Chapters
            </div>
            <div className="practice-stat-pill">
              <strong>100%</strong> In-Browser Viewable
            </div>
          </div>
        </div>

        {masterLadrDoc && (
          <div className="ladr-featured-card">
            <div className="ladr-card-header">
              <BookMarked size={24} style={{ color: 'var(--accent-amber)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  Linear Algebra Done Right (4th Ed)
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Sheldon Axler Complete Solution Manual
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '12px 0' }}>
              Full 9 chapters compiled into a single consolidated PDF manual alongside chapter-wise breakdown.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-primary"
                onClick={() => onPreview(masterLadrDoc)}
                style={{ flex: 1, padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <Eye size={15} />
                <span>Open Full Manual</span>
              </button>
              <a
                href={masterLadrDoc.download_url}
                download={masterLadrDoc.filename}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download"
                style={{ padding: '8px 12px' }}
                title="Download Master PDF"
              >
                <Download size={15} />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Module Selector Pills */}
      <div className="practice-module-grid">
        {MODULES.map((mod) => {
          const isActive = selectedModule === mod.id;
          return (
            <button
              key={mod.id}
              className={`practice-module-card ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedModule(mod.id)}
            >
              <div className="module-card-icon">{mod.icon}</div>
              <div className="module-card-text">
                <span className="module-card-label">{mod.label}</span>
                <span className="module-card-desc">{mod.description}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="practice-search-bar" style={{ margin: '24px 0 16px 0' }}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search across practice problems, chapters, or textbook titles (e.g. 'Gram-Schmidt', 'Eigenvalues', 'Chapter 3')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="clear-search-btn"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Showing <strong>{filteredDocs.length}</strong> matching documents in{' '}
          <span style={{ color: 'var(--accent-primary)' }}>
            {MODULES.find((m) => m.id === selectedModule)?.label}
          </span>
        </span>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length > 0 ? (
        <div className="doc-grid">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id} 
              className="doc-card" 
              onClick={() => onPreview(doc)} 
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="card-top">
                  <div className="card-tags">
                    <span className="tag-badge code">{doc.subject_code}</span>
                    {doc.year && <span className="tag-badge year">{doc.year}</span>}
                    <span className="tag-badge category">{doc.category_label}</span>
                  </div>
                  <div className="file-type-icon">{doc.file_type}</div>
                </div>

                <h3 className="doc-title" title={doc.filename}>
                  {doc.title}
                </h3>

                <div className="doc-meta">
                  <span>{doc.size_formatted}</span>
                  <span>•</span>
                  <span>{doc.sub_category ? doc.sub_category.replace(/_/g, ' ') : doc.subject_name}</span>
                </div>
              </div>

              <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="btn-preview"
                  onClick={() => onPreview(doc)}
                  title="Open in in-browser viewer"
                >
                  <Eye size={15} />
                  <span>View</span>
                </button>

                <a
                  href={doc.download_url}
                  download={doc.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-download"
                  title="Direct Download"
                >
                  <Download size={15} />
                </a>

                <button
                  className="btn-download"
                  onClick={(e) => handleCopyLink(doc, e)}
                  title={copiedId === doc.id ? 'Link Copied!' : 'Copy Direct Link'}
                >
                  {copiedId === doc.id ? (
                    <Check size={15} style={{ color: 'var(--accent-emerald)' }} />
                  ) : (
                    <Share2 size={15} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BookOpen size={48} style={{ opacity: 0.4, margin: '0 auto 16px' }} />
          <h3>No practice materials found</h3>
          <p>Try searching with different keywords or switch module categories.</p>
        </div>
      )}
    </div>
  );
};
