import { useState, useEffect, useMemo, useRef } from 'react';
import type { CatalogData, CatalogDocument, CategoryFilter } from './types/catalog';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SubjectTabs } from './components/SubjectTabs';
import { CategoryFilterBar } from './components/CategoryFilter';
import { DocumentCard } from './components/DocumentCard';
import { PdfViewerModal } from './components/PdfViewerModal';
import { SyncModal } from './components/SyncModal';
import { EmptyState } from './components/EmptyState';
import { Search, X, Loader2 } from 'lucide-react';

export function App() {
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('study_material_theme') as 'dark' | 'light') || 'dark';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [activePreviewDoc, setActivePreviewDoc] = useState<CatalogDocument | null>(null);

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync theme with document attribute & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('study_material_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keyboard shortcut: Press "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key === 'k')) &&
        document.activeElement !== searchInputRef.current
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch catalog function with cache-busting
  const fetchCatalogData = async (showRefreshState = false) => {
    if (showRefreshState) setIsRefreshing(true);
    try {
      const res = await fetch(`/catalog.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to load catalog (${res.status} ${res.statusText})`);
      }
      const data: CatalogData = await res.json();
      setCatalog(data);
      setError(null);
    } catch (err: any) {
      console.error('Catalog fetch error:', err);
      if (!catalog) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      if (showRefreshState) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCatalogData(false);
  }, []);

  // Filtered documents calculation
  const filteredDocuments = useMemo(() => {
    if (!catalog) return [];

    return catalog.documents.filter((doc) => {
      // 1. Subject filter
      if (selectedSubject !== 'ALL' && doc.subject_id !== selectedSubject) {
        return false;
      }

      // 2. Category filter
      if (activeCategory !== 'ALL') {
        if (
          activeCategory === 'Mid_Semester' ||
          activeCategory === 'End_Semester' ||
          activeCategory === 'Summer_Semester'
        ) {
          if (doc.category !== activeCategory && doc.sub_category !== activeCategory) {
            return false;
          }
        } else if (activeCategory === 'downloaded_notes') {
          if (doc.category !== 'downloaded_notes' && !(doc.sub_category && doc.sub_category.startsWith('Unit_'))) {
            return false;
          }
        } else {
          if (doc.category !== activeCategory && doc.sub_category !== activeCategory) {
            return false;
          }
        }
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchFile = doc.filename.toLowerCase().includes(q);
        const matchSubject = doc.subject_name.toLowerCase().includes(q) || doc.subject_code.toLowerCase().includes(q);
        const matchCategory = doc.category_label.toLowerCase().includes(q);
        const matchYear = doc.year ? doc.year.includes(q) : false;

        if (!matchTitle && !matchFile && !matchSubject && !matchCategory && !matchYear) {
          return false;
        }
      }

      return true;
    });
  }, [catalog, selectedSubject, activeCategory, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('ALL');
    setActiveCategory('ALL');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Loader2 size={36} className="empty-icon" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading academic catalog...</p>
        </div>
      </div>
    );
  }

  if (error || !catalog) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="empty-state" style={{ maxWidth: '500px' }}>
          <h2 style={{ color: 'var(--accent-rose)', marginBottom: '8px' }}>Failed to Load Catalog</h2>
          <p style={{ color: 'var(--text-muted)' }}>{error || 'Unable to load course data.'}</p>
          <button className="btn-preview" style={{ marginTop: '16px' }} onClick={() => fetchCatalogData(false)}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="ambient-glow" />

      <div className="app-container">
        {/* Navigation */}
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          totalDocuments={catalog.total_documents}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          isRefreshing={isRefreshing}
        />

        {/* Hero Section */}
        <Hero catalog={catalog} />

        {/* Search & Filters Container */}
        <section className="controls-container">
          {/* Search Bar */}
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search by topic, subject code (e.g. EAEPC302), exam term, year, or unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Subject Tabs */}
          <SubjectTabs
            subjects={catalog.subjects}
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
            totalDocuments={catalog.total_documents}
          />

          {/* Category Filter Pills */}
          <CategoryFilterBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </section>

        {/* Results Header */}
        <div className="results-header">
          <div className="results-count">
            Showing <strong>{filteredDocuments.length}</strong> of <strong>{catalog.total_documents}</strong> documents
            {selectedSubject !== 'ALL' && ` in ${catalog.subjects.find((s) => s.id === selectedSubject)?.name}`}
            {activeCategory !== 'ALL' && ` (${activeCategory.replace('_', ' ')})`}
          </div>

          {(selectedSubject !== 'ALL' || activeCategory !== 'ALL' || searchQuery) && (
            <button
              onClick={handleClearFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Document Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="doc-grid">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} onPreview={setActivePreviewDoc} />
            ))}
          </div>
        ) : (
          <EmptyState onClearFilters={handleClearFilters} />
        )}

        {/* In-Browser PDF Viewer Modal */}
        <PdfViewerModal
          document={activePreviewDoc}
          onClose={() => setActivePreviewDoc(null)}
        />

        {/* Sync & Live Refresh Modal */}
        <SyncModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          onRefreshLocal={() => fetchCatalogData(true)}
          isRefreshing={isRefreshing}
          totalDocs={catalog.total_documents}
        />

        {/* Footer */}
        <footer className="app-footer">
          <p>
            NSUT 3rd Semester Academic Repository • Maintained by{' '}
            <a
              href="https://github.com/punitr2007"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}
            >
              Punit Ranjan
            </a>
          </p>
          <p style={{ fontSize: '0.78rem', marginTop: '6px', color: 'var(--text-muted)' }}>
            Catalog auto-synchronized with Google Drive & GitHub. Streaming PDF documents via jsDelivr CDN.
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
