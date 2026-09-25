import { useState, useEffect, useMemo, useRef } from 'react';
import type { CatalogData, CatalogDocument, CategoryFilter } from './types/catalog';
import type { AnalyticsData } from './types/analytics';
import type { SolutionsData, QuestionSolution } from './types/solutions';
import { Navbar, type ActiveNavView } from './components/Navbar';
import { Hero } from './components/Hero';
import { SubjectTabs } from './components/SubjectTabs';
import { CategoryFilterBar } from './components/CategoryFilter';
import { SubCategoryFilterBar } from './components/SubCategoryFilter';
import { YearFilterBar } from './components/YearFilter';
import { DocumentCard } from './components/DocumentCard';
import { PdfViewerModal } from './components/PdfViewerModal';
import { SyncModal } from './components/SyncModal';
import { EmptyState } from './components/EmptyState';
import { AnalyticsView } from './components/AnalyticsView';
import { SolutionsView } from './components/SolutionsView';
import { PracticeVaultView } from './components/PracticeVaultView';
import { DriveExplorer } from './components/DriveExplorer';
import { SolutionViewerModal } from './components/SolutionViewerModal';
import { Search, X, Loader2 } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

export function App() {
  const [activeNavView, setActiveNavView] = useState<ActiveNavView>('materials');
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [solutionsData, setSolutionsData] = useState<SolutionsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('study_material_theme') as 'dark' | 'light') || 'dark';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [activePreviewDoc, setActivePreviewDoc] = useState<CatalogDocument | null>(null);
  const [activeSolutionModal, setActiveSolutionModal] = useState<QuestionSolution | null>(null);

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

  // Fetch all static JSON manifests
  const fetchAllData = async (showRefreshState = false) => {
    if (showRefreshState) setIsRefreshing(true);
    try {
      const cacheBust = `?t=${Date.now()}`;
      const [catRes, anaRes, solRes] = await Promise.all([
        fetch(`/catalog.json${cacheBust}`, { cache: 'no-store' }),
        fetch(`/analytics.json${cacheBust}`, { cache: 'no-store' }),
        fetch(`/solutions.json${cacheBust}`, { cache: 'no-store' }),
      ]);

      if (!catRes.ok) {
        throw new Error(`Failed to load catalog (${catRes.status} ${catRes.statusText})`);
      }

      const catData: CatalogData = await catRes.json();
      setCatalog(catData);

      if (anaRes.ok) {
        const anaData: AnalyticsData = await anaRes.json();
        setAnalyticsData(anaData);
      }

      if (solRes.ok) {
        const solData: SolutionsData = await solRes.json();
        setSolutionsData(solData);
      }

      setError(null);
    } catch (err: any) {
      console.error('Data fetch error:', err);
      if (!catalog) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      if (showRefreshState) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData(false);
  }, []);

  // Unified category matching helper
  const isDocInCategory = (doc: CatalogDocument, catFilter: CategoryFilter): boolean => {
    if (catFilter === 'ALL') return true;
    const cat = doc.category;
    const path = doc.relative_path.toLowerCase();
    const sub = (doc.sub_category || '').toLowerCase();
    const label = (doc.category_label || '').toLowerCase();

    if (catFilter === 'Mid_Semester') {
      return cat === 'Mid_Semester' || path.includes('mid_semester') || sub.includes('mid-semester') || sub.includes('midsem') || label.includes('mid');
    }
    if (catFilter === 'End_Semester') {
      return cat === 'End_Semester' || path.includes('end_semester') || sub.includes('end-semester') || sub.includes('endsem') || label.includes('end');
    }
    if (catFilter === 'Summer_Semester') {
      return cat === 'Summer_Semester' || path.includes('summer_semester') || sub.includes('summer') || label.includes('summer');
    }
    if (catFilter === 'Practice_Material') {
      return cat === 'Practice_Material' || path.includes('practice_material') || sub.includes('practice') || sub.includes('problem set') || sub.includes('cheatsheet');
    }
    if (catFilter === 'Linear_Algebra_Done_Right') {
      return cat === 'Linear_Algebra_Done_Right' || path.includes('linear_algebra_done_right');
    }
    if (catFilter === 'downloaded_notes') {
      return cat === 'downloaded_notes' || path.includes('downloaded_notes') || Boolean(doc.sub_category && doc.sub_category.startsWith('Unit_'));
    }
    if (catFilter === 'Textbooks' || catFilter === 'Textbooks_and_References') {
      return cat === 'Textbooks' || cat === 'Textbooks_and_References' || path.includes('textbooks');
    }
    if (catFilter === 'Assignments') {
      return cat === 'Assignments' || cat === 'Assignments_and_Tutorials' || path.includes('assignments');
    }
    if (catFilter === 'Lab_Manuals_and_Experiments') {
      return cat === 'Lab_Manuals_and_Experiments' || path.includes('lab_manuals');
    }
    if (catFilter === 'Handwritten_Notes') {
      return cat === 'Handwritten_Notes' || path.includes('handwritten_notes');
    }
    if (catFilter === 'Lecture_Slides') {
      return cat === 'Lecture_Slides' || cat === 'Lecture_Slides_Prof_Razavi' || path.includes('lecture_slides');
    }
    return cat === catFilter || doc.sub_category === catFilter;
  };

  // Dynamically compute category counts for the active subject context
  const { categoryCounts, totalActiveSubjectDocs } = useMemo(() => {
    if (!catalog) return { categoryCounts: {} as Record<string, number>, totalActiveSubjectDocs: 0 };
    const counts: Record<string, number> = {};
    let total = 0;

    catalog.documents.forEach((doc) => {
      if (selectedSubject !== 'ALL' && doc.subject_id !== selectedSubject) {
        return;
      }
      total += 1;

      const keys: CategoryFilter[] = [
        'Mid_Semester',
        'End_Semester',
        'Summer_Semester',
        'Practice_Material',
        'Linear_Algebra_Done_Right',
        'downloaded_notes',
        'Textbooks',
        'Assignments',
        'Lab_Manuals_and_Experiments',
        'Handwritten_Notes',
        'Lecture_Slides'
      ];

      keys.forEach((k) => {
        if (isDocInCategory(doc, k)) {
          counts[k] = (counts[k] || 0) + 1;
        }
      });
    });

    return { categoryCounts: counts, totalActiveSubjectDocs: total };
  }, [catalog, selectedSubject]);

  // Dynamically compute subcategories for active subject + category
  const availableSubCategories = useMemo(() => {
    if (!catalog || activeCategory === 'ALL') return [];
    const subMap: Record<string, number> = {};

    catalog.documents.forEach((doc) => {
      if (selectedSubject !== 'ALL' && doc.subject_id !== selectedSubject) return;
      if (!isDocInCategory(doc, activeCategory)) return;

      if (doc.sub_category && doc.sub_category !== activeCategory) {
        subMap[doc.sub_category] = (subMap[doc.sub_category] || 0) + 1;
      }
    });

    return Object.entries(subMap)
      .filter(([_, count]) => count > 0)
      .map(([key, count]) => ({
        key,
        label: key,
        count
      }));
  }, [catalog, selectedSubject, activeCategory]);

  // Auto-reset category & subcategory if non-existent in new subject context
  useEffect(() => {
    if (activeCategory !== 'ALL' && (!categoryCounts[activeCategory] || categoryCounts[activeCategory] === 0)) {
      setActiveCategory('ALL');
    }
    setSelectedSubCategory('ALL');
  }, [selectedSubject, categoryCounts]);

  useEffect(() => {
    setSelectedSubCategory('ALL');
  }, [activeCategory]);

  // Calculate available years and document counts per year
  const { availableYears, yearCounts } = useMemo(() => {
    if (!catalog) return { availableYears: [], yearCounts: {} };
    const counts: Record<string, number> = {};
    const allKnownYears = new Set<string>();

    catalog.documents.forEach((doc) => {
      if (doc.year) {
        // Track count considering subject and category filters
        if (selectedSubject !== 'ALL' && doc.subject_id !== selectedSubject) return;
        if (activeCategory !== 'ALL' && !isDocInCategory(doc, activeCategory)) return;

        if (selectedSubCategory !== 'ALL' && doc.sub_category !== selectedSubCategory) {
          return;
        }

        allKnownYears.add(doc.year);
        counts[doc.year] = (counts[doc.year] || 0) + 1;
      }
    });

    const sortedYears = Array.from(allKnownYears).sort((a, b) => b.localeCompare(a));
    return { availableYears: sortedYears, yearCounts: counts };
  }, [catalog, selectedSubject, activeCategory, selectedSubCategory]);

  // Auto-reset year if selected year has 0 documents in new filter
  useEffect(() => {
    if (selectedYear !== 'ALL' && (!yearCounts[selectedYear] || yearCounts[selectedYear] === 0)) {
      setSelectedYear('ALL');
    }
  }, [selectedSubject, activeCategory, selectedSubCategory, yearCounts]);

  // Filtered documents calculation for Materials View
  const filteredDocuments = useMemo(() => {
    if (!catalog) return [];

    return catalog.documents.filter((doc) => {
      // 1. Subject filter
      if (selectedSubject !== 'ALL' && doc.subject_id !== selectedSubject) {
        return false;
      }

      // 2. Category filter
      if (activeCategory !== 'ALL' && !isDocInCategory(doc, activeCategory)) {
        return false;
      }

      // 3. Sub-Category filter
      if (selectedSubCategory !== 'ALL' && doc.sub_category !== selectedSubCategory) {
        return false;
      }

      // 4. Year filter
      if (selectedYear !== 'ALL' && doc.year !== selectedYear) {
        return false;
      }

      // 5. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchFile = doc.filename.toLowerCase().includes(q);
        const matchSubject = doc.subject_name.toLowerCase().includes(q) || doc.subject_code.toLowerCase().includes(q);
        const matchCategory = doc.category_label.toLowerCase().includes(q);
        const matchSubCategory = doc.sub_category ? doc.sub_category.toLowerCase().includes(q) : false;
        const matchYear = doc.year ? doc.year.includes(q) : false;

        if (!matchTitle && !matchFile && !matchSubject && !matchCategory && !matchSubCategory && !matchYear) {
          return false;
        }
      }

      return true;
    });
  }, [catalog, selectedSubject, activeCategory, selectedSubCategory, selectedYear, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('ALL');
    setActiveCategory('ALL');
    setSelectedSubCategory('ALL');
    setSelectedYear('ALL');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Loader2 size={36} className="empty-icon" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading academic workspace...</p>
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
          <button className="btn-preview" style={{ marginTop: '16px' }} onClick={() => fetchAllData(false)}>
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
        {/* Navigation Bar */}
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          totalDocuments={catalog.total_documents}
          activeView={activeNavView}
          setActiveView={setActiveNavView}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          isRefreshing={isRefreshing}
        />

        {/* Dynamic View Rendering */}
        {activeNavView === 'materials' && (
          <>
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

              {/* Context-Aware Dynamic Category Filter Pills */}
              <CategoryFilterBar
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                categoryCounts={categoryCounts}
                totalDocuments={totalActiveSubjectDocs}
              />

              {/* Granular Sub-Category / Module Filter Chips */}
              <SubCategoryFilterBar
                availableSubCategories={availableSubCategories}
                selectedSubCategory={selectedSubCategory}
                onSelectSubCategory={setSelectedSubCategory}
              />

              {/* Dynamic Exam Year Filter Pills (Auto-hidden when empty) */}
              <YearFilterBar
                availableYears={availableYears}
                selectedYear={selectedYear}
                onSelectYear={setSelectedYear}
                yearCounts={yearCounts}
              />
            </section>

            {/* Results Header */}
            <div className="results-header">
              <div className="results-count">
                Showing <strong>{filteredDocuments.length}</strong> of <strong>{catalog.total_documents}</strong> documents
                {selectedSubject !== 'ALL' && ` in ${catalog.subjects.find((s) => s.id === selectedSubject)?.name}`}
                {activeCategory !== 'ALL' && ` (${activeCategory.replace(/_/g, ' ')})`}
                {selectedSubCategory !== 'ALL' && ` • ${selectedSubCategory}`}
                {selectedYear !== 'ALL' && ` • Year ${selectedYear}`}
              </div>

              {(selectedSubject !== 'ALL' || activeCategory !== 'ALL' || selectedSubCategory !== 'ALL' || selectedYear !== 'ALL' || searchQuery) && (
                <button
                  onClick={handleClearFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
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
          </>
        )}

        {activeNavView === 'practice' && (
          <PracticeVaultView
            documents={catalog.documents}
            onPreview={setActivePreviewDoc}
          />
        )}

        {activeNavView === 'drive' && (
          <DriveExplorer />
        )}

        {activeNavView === 'analytics' && (
          <AnalyticsView
            analyticsData={analyticsData}
            selectedSubjectId={selectedSubject === 'ALL' ? '01_Signals_and_Systems_EAEPC302' : selectedSubject}
            onSelectSubject={(subId) => setSelectedSubject(subId)}
          />
        )}

        {activeNavView === 'solutions' && (
          <SolutionsView
            solutionsData={solutionsData}
            selectedSubjectId={selectedSubject}
            onSelectSubject={(subId) => setSelectedSubject(subId)}
            onSelectSolution={(sol) => setActiveSolutionModal(sol)}
          />
        )}

        {/* In-Browser PDF Viewer Modal */}
        <PdfViewerModal
          document={activePreviewDoc}
          onClose={() => setActivePreviewDoc(null)}
        />

        {/* AI Solution Viewer Modal */}
        <SolutionViewerModal
          solution={activeSolutionModal}
          onClose={() => setActiveSolutionModal(null)}
        />

        {/* Sync & Live Refresh Modal */}
        <SyncModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          onRefreshLocal={() => fetchAllData(true)}
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

      <Analytics />
    </>
  );
}

export default App;

