import React, { useState, useEffect } from 'react';
import { CaseFile, UserProfile, LanguageCode, CaseBookmark } from './types';
import { SAMPLE_CASES, DEMO_USERS, MOCK_ANALYTICS } from './data/sampleCases';
import { Header } from './components/Header';
import { GroundedViewer } from './components/GroundedViewer';
import { CaseList } from './components/CaseList';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { FileUploadModal } from './components/FileUploadModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { PitchBanner } from './components/PitchBanner';
import { MyLibrary } from './components/MyLibrary';

const INITIAL_BOOKMARKS: CaseBookmark[] = [
  {
    caseId: 'CASE-2026-001',
    bookmarkedAt: new Date().toISOString(),
    folder: 'Bail & Custody',
    notes: 'Urgent medical grounds bail petition. Precedent ratio under Section 439 CrPC to cite in Coram hearing.'
  },
  {
    caseId: 'CASE-2026-002',
    bookmarkedAt: new Date().toISOString(),
    folder: 'Precedent Research',
    notes: 'Key Constitutional Bench ruling regarding Section 11 arbitration appointment timeframe.'
  }
];

export default function App() {
  const [cases, setCases] = useState<CaseFile[]>(SAMPLE_CASES);
  const [selectedCase, setSelectedCase] = useState<CaseFile>(SAMPLE_CASES[0]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [activeTab, setActiveTab] = useState<'cases' | 'viewer' | 'analytics' | 'library' | 'pitch'>('viewer');
  
  // Bookmarks State with localStorage persistence
  const [bookmarks, setBookmarks] = useState<CaseBookmark[]>(() => {
    try {
      const saved = localStorage.getItem('saakshya_case_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading bookmarks:', e);
    }
    return INITIAL_BOOKMARKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('saakshya_case_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Error saving bookmarks:', e);
    }
  }, [bookmarks]);

  // Bookmark Handlers
  const handleToggleBookmark = (caseId: string) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.caseId === caseId);
      if (exists) {
        return prev.filter((b) => b.caseId !== caseId);
      } else {
        return [
          ...prev,
          {
            caseId,
            bookmarkedAt: new Date().toISOString(),
            folder: 'General',
            notes: ''
          }
        ];
      }
    });
  };

  const handleUpdateBookmarkDetails = (caseId: string, folder?: string, notes?: string) => {
    setBookmarks((prev) =>
      prev.map((b) =>
        b.caseId === caseId
          ? {
              ...b,
              folder: folder !== undefined ? folder : b.folder,
              notes: notes !== undefined ? notes : b.notes
            }
          : b
      )
    );
  };
  
  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Translation State
  const [isTranslating, setIsTranslating] = useState(false);

  // Natural Language Search State
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiSearchExplanation, setAiSearchExplanation] = useState<string | null>(null);

  // Case Selection Handler
  const handleSelectCase = (c: CaseFile) => {
    setSelectedCase(c);
    setActiveTab('viewer');
  };

  // Created Case Handler
  const handleCaseCreated = (newCase: CaseFile) => {
    setCases((prev) => [newCase, ...prev]);
    setSelectedCase(newCase);
    setActiveTab('viewer');
  };

  // Draft Order Update Handler
  const handleUpdateDraftOrder = (updatedOrder: any) => {
    const updatedCase = {
      ...selectedCase,
      draftOrder: updatedOrder
    };
    setSelectedCase(updatedCase);
    setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
  };

  // Multi-Language Translation Handler
  const handleTranslateSummary = async (targetLang: LanguageCode, targetName: string) => {
    if (!selectedCase.summary?.sentences) return;
    setIsTranslating(true);

    try {
      const response = await fetch('/api/translate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentences: selectedCase.summary.sentences,
          targetLanguage: targetLang,
          targetLanguageName: targetName
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();

      // Cache translation on case object
      const updatedCase: CaseFile = {
        ...selectedCase,
        translations: {
          ...(selectedCase.translations || {}),
          [targetLang]: data.sentences
        }
      };

      setSelectedCase(updatedCase);
      setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Natural Language Search Handler
  const handleNaturalLanguageSearch = async (query: string) => {
    setIsSearchingAI(true);
    setAiSearchExplanation(null);

    try {
      const response = await fetch('/api/natural-language-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          cases
        })
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setAiSearchExplanation(data.explanation || 'Analyzed case facts against your query intent.');
    } catch (err) {
      console.error('AI search error:', err);
    } finally {
      setIsSearchingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Navigation */}
      <Header
        currentUser={currentUser}
        users={DEMO_USERS}
        onSwitchUser={setCurrentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        selectedCaseTitle={selectedCase.title}
        bookmarkCount={bookmarks.length}
      />

      {/* Main Tab Area */}
      <main className="flex-1">
        {activeTab === 'viewer' && (
          <GroundedViewer
            caseFile={selectedCase}
            userRole={currentUser.role}
            onUpdateDraftOrder={handleUpdateDraftOrder}
            onTranslateSummary={handleTranslateSummary}
            isTranslating={isTranslating}
            isBookmarked={bookmarks.some((b) => b.caseId === selectedCase.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'cases' && (
          <CaseList
            cases={cases}
            onSelectCase={handleSelectCase}
            onNaturalLanguageSearch={handleNaturalLanguageSearch}
            isSearchingAI={isSearchingAI}
            aiSearchExplanation={aiSearchExplanation}
            bookmarkedIds={bookmarks.map((b) => b.caseId)}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'library' && (
          <MyLibrary
            cases={cases}
            bookmarks={bookmarks}
            onSelectCase={handleSelectCase}
            onToggleBookmark={handleToggleBookmark}
            onUpdateBookmarkDetails={handleUpdateBookmarkDetails}
            userRole={currentUser.role}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard analytics={MOCK_ANALYTICS} />
        )}

        {activeTab === 'pitch' && (
          <PitchBanner onStartDemo={() => setActiveTab('viewer')} />
        )}
      </main>

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onCaseCreated={handleCaseCreated}
      />

      {/* How It Works Pitch Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}
