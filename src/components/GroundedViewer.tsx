import React, { useState, useRef, useEffect } from 'react';
import { CaseFile, GroundedSentence, LanguageCode, UserRole } from '../types';
import {
  FileText,
  Languages,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Search,
  Quote,
  Network,
  Gavel,
  AlertOctagon,
  Copy,
  Check,
  RefreshCw,
  Info,
  Download,
  Loader2,
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Headphones,
  Radio,
  X,
  Milestone,
  Printer,
  Scale,
  MessageSquare
} from 'lucide-react';
import { PrecedentCitationGraph } from './PrecedentCitationGraph';
import { DraftOrderSheet } from './DraftOrderSheet';
import { CaseTimeline } from './CaseTimeline';
import { UrgencyBadge } from './UrgencyBadge';
import { ConsistencyAnalysis } from './ConsistencyAnalysis';
import { generateCaseBriefPDF, generateFullCasePackagePDF } from '../utils/pdfExporter';

interface GroundedViewerProps {
  caseFile: CaseFile;
  userRole: UserRole;
  onUpdateDraftOrder?: (updatedOrder: any) => void;
  onTranslateSummary?: (targetLang: LanguageCode, targetName: string) => Promise<void>;
  isTranslating?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (caseId: string) => void;
}

const LANGUAGES: { code: LanguageCode; name: string; native: string }[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' }
];

export const GroundedViewer: React.FC<GroundedViewerProps> = ({
  caseFile,
  userRole,
  onUpdateDraftOrder,
  onTranslateSummary,
  isTranslating = false,
  isBookmarked = false,
  onToggleBookmark
}) => {
  const [selectedSentenceId, setSelectedSentenceId] = useState<string | null>(
    caseFile.summary?.sentences?.[0]?.id || null
  );
  const [activeParagraphId, setActiveParagraphId] = useState<number | null>(
    caseFile.summary?.sentences?.[0]?.sourceParagraphId || 1
  );
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<'summary' | 'citation' | 'timeline' | 'order' | 'urgency' | 'consistency'>('summary');
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [copiedSentenceId, setCopiedSentenceId] = useState<string | null>(null);
  const [isExportingBrief, setIsExportingBrief] = useState(false);
  const [briefExportStatus, setBriefExportStatus] = useState('');

  // Plain Language Mode State
  const [isPlainLanguage, setIsPlainLanguage] = useState(false);
  const [plainSentences, setPlainSentences] = useState<GroundedSentence[] | null>(
    caseFile.plainLanguageSummary || null
  );
  const [isGeneratingPlainLang, setIsGeneratingPlainLang] = useState(false);

  const handleTogglePlainLanguage = async () => {
    const nextMode = !isPlainLanguage;
    setIsPlainLanguage(nextMode);

    if (nextMode && !plainSentences) {
      try {
        setIsGeneratingPlainLang(true);
        const res = await fetch('/api/plain-language-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sentences: caseFile.summary.sentences })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.plainLanguageSummary) {
            setPlainSentences(data.plainLanguageSummary);
            caseFile.plainLanguageSummary = data.plainLanguageSummary;
          }
        }
      } catch (err) {
        console.error('Failed to generate plain language summary:', err);
      } finally {
        setIsGeneratingPlainLang(false);
      }
    }
  };

  // Text Highlighting Helper Function
  const renderHighlightedText = (text: string, query: string) => {
    if (!query || !query.trim()) return text;
    const trimmed = query.trim();
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    if (parts.length <= 1) return text;

    return parts.map((part, index) =>
      part.toLowerCase() === trimmed.toLowerCase() ? (
        <mark
          key={index}
          className="bg-purple-500/40 text-purple-100 font-bold px-1 py-0.5 rounded border border-purple-400/60 shadow-sm"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Calculate total search term occurrences
  const totalMatches = React.useMemo(() => {
    if (!docSearchQuery.trim()) return 0;
    const q = docSearchQuery.trim().toLowerCase();
    let count = 0;
    caseFile.paragraphs.forEach((p) => {
      const occurrences = p.text.toLowerCase().split(q).length - 1;
      count += Math.max(0, occurrences);
    });
    return count;
  }, [docSearchQuery, caseFile.paragraphs]);

  // Auto scroll to first matching paragraph on search
  useEffect(() => {
    if (docSearchQuery.trim()) {
      const q = docSearchQuery.trim().toLowerCase();
      const firstMatch = caseFile.paragraphs.find((p) => p.text.toLowerCase().includes(q));
      if (firstMatch) {
        const el = paragraphRefs.current[firstMatch.id];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [docSearchQuery, caseFile]);

  const handleExportSummaryPDF = async () => {
    setIsExportingBrief(true);
    try {
      const currentLangObj = LANGUAGES.find((l) => l.code === selectedLanguage);
      await generateCaseBriefPDF(
        caseFile,
        selectedLanguage,
        currentLangObj?.name || 'English',
        (status) => setBriefExportStatus(status)
      );
    } catch (err) {
      console.error('Failed to export case brief PDF:', err);
    } finally {
      setIsExportingBrief(false);
      setBriefExportStatus('');
    }
  };

  const [isExportingPackage, setIsExportingPackage] = useState(false);
  const [packageExportStatus, setPackageExportStatus] = useState('');

  const handleExportFullPackagePDF = async () => {
    setIsExportingPackage(true);
    try {
      const currentLangObj = LANGUAGES.find((l) => l.code === selectedLanguage);
      await generateFullCasePackagePDF(
        caseFile,
        caseFile.draftOrder,
        selectedLanguage,
        currentLangObj?.name || 'English',
        (status) => setPackageExportStatus(status)
      );
    } catch (err) {
      console.error('Failed to export full case package PDF:', err);
    } finally {
      setIsExportingPackage(false);
      setPackageExportStatus('');
    }
  };

  // Refs for paragraph scrolling
  const paragraphRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Text-To-Speech (TTS) Engine State
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [isPausedTTS, setIsPausedTTS] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  // Active sentences list based on language selection and plain language mode
  const currentSentences: GroundedSentence[] =
    isPlainLanguage && plainSentences
      ? plainSentences
      : selectedLanguage !== 'en' && caseFile.translations?.[selectedLanguage]
      ? caseFile.translations[selectedLanguage]
      : caseFile.summary.sentences;

  // Ref to track current sentences inside async audio callbacks
  const currentSentencesRef = useRef<GroundedSentence[]>([]);
  currentSentencesRef.current = currentSentences;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const speakSentenceAtIndex = (index: number, sentencesList: GroundedSentence[]) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (index >= sentencesList.length) {
      setIsPlayingTTS(false);
      setIsPausedTTS(false);
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingIndex(index);
    setIsPlayingTTS(true);
    setIsPausedTTS(false);

    const s = sentencesList[index];
    setSelectedSentenceId(s.id);
    setActiveParagraphId(s.sourceParagraphId);

    const pElement = paragraphRefs.current[s.sourceParagraphId];
    if (pElement) {
      pElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const utterance = new SpeechSynthesisUtterance(s.sentence);
    utterance.rate = speechRate;

    if (selectedVoiceURI) {
      const v = voices.find((voice) => voice.voiceURI === selectedVoiceURI);
      if (v) utterance.voice = v;
    } else {
      const langVoice = voices.find((v) =>
        v.lang.toLowerCase().startsWith(selectedLanguage)
      );
      if (langVoice) utterance.voice = langVoice;
    }

    utterance.onend = () => {
      speakSentenceAtIndex(index + 1, currentSentencesRef.current);
    };

    utterance.onerror = () => {
      setIsPlayingTTS(false);
      setIsPausedTTS(false);
      setSpeakingIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStartListen = (startIndex?: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech audio reader is not supported in this browser.');
      return;
    }

    if (isPausedTTS) {
      window.speechSynthesis.resume();
      setIsPausedTTS(false);
      setIsPlayingTTS(true);
      return;
    }

    const idx = startIndex !== undefined ? startIndex : (speakingIndex ?? 0);
    speakSentenceAtIndex(idx, currentSentences);
  };

  const handlePauseListen = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPausedTTS(true);
      setIsPlayingTTS(false);
    }
  };

  const handleStopListen = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      setIsPausedTTS(false);
      setSpeakingIndex(null);
    }
  };

  // Stop TTS on language switch or unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedLanguage, caseFile.id]);

  // Handle clicking a sentence in the summary
  const handleSelectSentence = (sentence: GroundedSentence) => {
    setSelectedSentenceId(sentence.id);
    setActiveParagraphId(sentence.sourceParagraphId);

    // Scroll to paragraph on the left
    const paragraphElement = paragraphRefs.current[sentence.sourceParagraphId];
    if (paragraphElement) {
      paragraphElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Language Change Handler
  const handleLanguageChange = async (langCode: LanguageCode) => {
    setSelectedLanguage(langCode);
    if (langCode !== 'en' && (!caseFile.translations || !caseFile.translations[langCode])) {
      const langObj = LANGUAGES.find((l) => l.code === langCode);
      if (onTranslateSummary && langObj) {
        await onTranslateSummary(langCode, langObj.name);
      }
    }
  };

  const handleCopySentence = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSentenceId(id);
    setTimeout(() => setCopiedSentenceId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#08090a] text-white overflow-hidden">
      
      {/* Top Case Details Header */}
      <div className="bg-[#111214] border-b border-white/10 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#08090a] text-purple-400 border border-white/10">
                {caseFile.caseNumber}
              </span>
              <span className="text-xs text-zinc-400">• {caseFile.court}</span>
              <span className="text-xs text-zinc-400 font-mono">• Filed: {caseFile.filingDate}</span>
            </div>
            <h2 className="text-xl font-extrabold font-syne text-white tracking-tight mt-0.5">
              {caseFile.title}
            </h2>
          </div>
        </div>

        {/* Top Right Controls & Tabs */}
        <div className="flex items-center space-x-3">
          <UrgencyBadge urgency={caseFile.urgency} size="md" />

          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(caseFile.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all shadow ${
                isBookmarked
                  ? 'bg-purple-600 text-white border-purple-400 font-bold'
                  : 'bg-[#08090a] text-zinc-300 hover:text-white border-white/10 hover:border-white/20'
              }`}
              title={isBookmarked ? 'Remove from My Library' : 'Save to My Library'}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 fill-white text-white" />
                  <span>Bookmarked</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-purple-400" />
                  <span>Bookmark Case</span>
                </>
              )}
            </button>
          )}

          {/* Sub Navigation Tabs */}
          <div className="flex items-center space-x-1 bg-[#08090a] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'summary'
                  ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/50'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('citation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'citation'
                  ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/50'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Citation Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/50'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Milestone className="w-3.5 h-3.5" />
              <span>Case Timeline</span>
            </button>

            <button
              onClick={() => setActiveTab('order')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'order'
                  ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/50'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>Draft Order Sheet</span>
            </button>

            <button
              onClick={() => setActiveTab('urgency')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'urgency'
                  ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/50'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Urgency Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('consistency')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 relative ${
                activeTab === 'consistency'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-900/50'
                  : 'text-zinc-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Consistency & Fairness</span>
              {caseFile.consistencyAnalysis?.isOutlier && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Area */}
      <div className="flex-1 min-h-0">
        
        {/* TAB 1: Grounded Summary Split View */}
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            
            {/* LEFT COLUMN: Original Document Reader (5/12) */}
            <div className="lg:col-span-5 flex flex-col h-full bg-slate-950">
              {/* Document Sub-Header */}
              <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center">
                    Original Case File Text
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {caseFile.paragraphs.length} Paragraphs
                  </span>
                </div>

                {/* Filter / Search within Document */}
                <div className="flex items-center space-x-1.5">
                  <div className="relative w-44">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-purple-400" />
                    <input
                      type="text"
                      placeholder="Find in document..."
                      value={docSearchQuery}
                      onChange={(e) => setDocSearchQuery(e.target.value)}
                      className="w-full bg-[#08090a] border border-white/10 rounded-lg pl-8 pr-7 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-sans"
                    />
                    {docSearchQuery && (
                      <button
                        onClick={() => setDocSearchQuery('')}
                        className="absolute right-2 top-1.5 text-zinc-500 hover:text-white"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {docSearchQuery.trim() && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                      {totalMatches} {totalMatches === 1 ? 'match' : 'matches'}
                    </span>
                  )}
                </div>
              </div>

              {/* Document Paragraphs Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
                {caseFile.paragraphs.map((p) => {
                  const isActive = activeParagraphId === p.id;
                  const isHighlighted =
                    docSearchQuery.trim() !== '' &&
                    p.text.toLowerCase().includes(docSearchQuery.toLowerCase());

                  return (
                    <div
                      key={p.id}
                      ref={(el) => { paragraphRefs.current[p.id] = el; }}
                      className={`p-4 rounded-xl transition-all duration-300 border text-sm relative group ${
                        isActive
                          ? 'bg-purple-950/30 border-purple-500/80 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40'
                          : isHighlighted
                          ? 'bg-purple-950/20 border-purple-500/50 shadow'
                          : 'bg-[#111214] border-white/5 hover:border-white/10'
                      }`}
                    >
                      {/* Paragraph Header Indicator */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                              isActive
                                ? 'bg-purple-600 text-white'
                                : 'bg-[#08090a] text-zinc-400 border border-white/10'
                            }`}
                          >
                            Paragraph {p.id}
                          </span>
                          {isHighlighted && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/40">
                              Search Match
                            </span>
                          )}
                        </div>

                        {isActive && (
                          <span className="text-[11px] font-semibold text-purple-400 flex items-center space-x-1 animate-pulse">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Grounded Source Target</span>
                          </span>
                        )}
                      </div>

                      {/* Paragraph Text with Live Highlighting */}
                      <p className="text-zinc-300 leading-relaxed font-sans text-xs sm:text-sm">
                        {renderHighlightedText(p.text, docSearchQuery)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: AI Grounded Summary Engine (7/12) */}
            <div className="lg:col-span-7 flex flex-col h-full bg-slate-900/40">
              
              {/* Summary Controls & Multi-Language Selector */}
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center">
                    Grounded AI Summary
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                    Traceable Sentence Mode
                  </span>
                </div>

                {/* Multi-Language Bar & PDF Export Button */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                    <Languages className="w-3.5 h-3.5 text-amber-400" />
                    <span>Language:</span>
                  </span>

                  <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        disabled={isTranslating}
                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                          selectedLanguage === lang.code
                            ? 'bg-amber-500 text-slate-950 font-bold shadow'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {lang.native}
                      </button>
                    ))}
                  </div>

                  {isTranslating && (
                    <span className="text-xs text-amber-400 flex items-center space-x-1 animate-spin">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </span>
                  )}

                  {/* Plain Language Mode Toggle */}
                  <button
                    onClick={handleTogglePlainLanguage}
                    disabled={isGeneratingPlainLang}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center space-x-1.5 shrink-0 ${
                      isPlainLanguage
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                        : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                    }`}
                    title="Toggle between Legal Terminology and Plain Non-Legal Language for litigants"
                  >
                    {isGeneratingPlainLang ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    ) : (
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{isPlainLanguage ? 'Plain Language ON' : 'Plain Language Mode'}</span>
                  </button>

                  <button
                    onClick={handleExportSummaryPDF}
                    disabled={isExportingBrief || isExportingPackage}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-amber-600/50 text-slate-950 font-bold text-xs shadow transition-all flex items-center space-x-1.5 shrink-0 ml-2"
                    title="Export Executive Case Brief as PDF"
                  >
                    {isExportingBrief ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{briefExportStatus || 'Exporting...'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Brief PDF</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleExportFullPackagePDF}
                    disabled={isExportingBrief || isExportingPackage}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800/50 text-white font-bold text-xs shadow transition-all flex items-center space-x-1.5 shrink-0"
                    title="Export Full Case Dossier (Summary + Draft Order) as PDF"
                  >
                    {isExportingPackage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{packageExportStatus || 'Exporting Dossier...'}</span>
                      </>
                    ) : (
                      <>
                        <Printer className="w-3.5 h-3.5 text-purple-200" />
                        <span>Export Summary & Order PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Explanatory Banner */}
              <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-300 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Click any summary sentence below to highlight and jump to its verified source paragraph.
                  </span>
                </div>
                <span className="font-mono text-[11px] text-amber-400/80 font-bold hidden sm:inline">
                  {currentSentences.length} Trace Points
                </span>
              </div>

              {/* Active Plain Language Mode Banner */}
              {isPlainLanguage && (
                <div className="px-4 py-2.5 bg-amber-500/20 border-b border-amber-500/40 text-xs text-amber-200 flex items-center justify-between shrink-0 animate-fadeIn">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Plain Language Mode Active:</strong> Rewritten into non-legal phrasing for litigants & families while preserving sentence-to-paragraph grounding.
                    </span>
                  </div>
                  <button
                    onClick={() => setIsPlainLanguage(false)}
                    className="text-amber-400 hover:text-white font-bold text-[11px] underline shrink-0 ml-2"
                  >
                    Switch to Legalese
                  </button>
                </div>
              )}

              {/* HANDS-FREE ACCESSIBILITY: LISTEN TO SUMMARY AUDIO BAR */}
              <div className="bg-slate-950/90 border-b border-slate-800 p-3 px-4 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Headphones className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Listen to Summary
                    </span>
                  </div>

                  {/* Primary Audio Controls */}
                  <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {!isPlayingTTS && !isPausedTTS ? (
                      <button
                        onClick={() => handleStartListen(0)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow transition-all transform active:scale-95"
                        title="Read full grounded summary aloud using Text-to-Speech"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950 stroke-[2.5]" />
                        <span>Read Summary Aloud</span>
                      </button>
                    ) : isPlayingTTS ? (
                      <>
                        <button
                          onClick={handlePauseListen}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow transition-all hover:bg-amber-400"
                          title="Pause narration"
                        >
                          <Pause className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Pause</span>
                        </button>
                        <button
                          onClick={handleStopListen}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center space-x-1 transition-all"
                          title="Stop narration"
                        >
                          <Square className="w-3 h-3 fill-slate-300" />
                          <span>Stop</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartListen()}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow transition-all hover:bg-emerald-400"
                          title="Resume narration"
                        >
                          <Play className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Resume</span>
                        </button>
                        <button
                          onClick={handleStopListen}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center space-x-1 transition-all"
                          title="Stop narration"
                        >
                          <Square className="w-3 h-3 fill-slate-300" />
                          <span>Stop</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Active Speech Progress Indicator */}
                  {(isPlayingTTS || isPausedTTS) && speakingIndex !== null && (
                    <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                      <Volume2 className={`w-3.5 h-3.5 ${isPlayingTTS ? 'animate-bounce text-amber-400' : 'text-slate-400'}`} />
                      <span>
                        {isPausedTTS ? 'Paused at' : 'Speaking'} Point {speakingIndex + 1} of {currentSentences.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Speech Settings: Speed & Voice */}
                <div className="flex items-center space-x-3">
                  {/* Speed Selector */}
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <span className="hidden sm:inline">Speed:</span>
                    <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                      {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => {
                            setSpeechRate(rate);
                            if (isPlayingTTS && speakingIndex !== null) {
                              speakSentenceAtIndex(speakingIndex, currentSentences);
                            }
                          }}
                          className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-all ${
                            speechRate === rate
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Voice Selector */}
                  {voices.length > 0 && (
                    <select
                      value={selectedVoiceURI}
                      onChange={(e) => {
                        setSelectedVoiceURI(e.target.value);
                        if (isPlayingTTS && speakingIndex !== null) {
                          speakSentenceAtIndex(speakingIndex, currentSentences);
                        }
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 max-w-[140px] truncate focus:outline-none focus:border-amber-500"
                    >
                      <option value="">Default Voice</option>
                      {voices
                        .filter((v) =>
                          selectedLanguage === 'en'
                            ? v.lang.startsWith('en')
                            : v.lang.toLowerCase().includes(selectedLanguage)
                        )
                        .slice(0, 8)
                        .map((v) => (
                          <option key={v.voiceURI} value={v.voiceURI}>
                            {v.name.replace(/Google|Microsoft/g, '').trim()}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Summary Sentence Cards Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentSentences.map((s, idx) => {
                  const isSelected = selectedSentenceId === s.id;
                  const isBeingSpoken = (isPlayingTTS || isPausedTTS) && speakingIndex === idx;

                  return (
                    <div
                      key={s.id || idx}
                      onClick={() => handleSelectSentence(s)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border relative group ${
                        isBeingSpoken
                          ? 'bg-amber-950/30 border-amber-400 ring-2 ring-amber-400/50 shadow-2xl scale-[1.01]'
                          : isSelected
                          ? 'bg-slate-900 border-amber-500/80 ring-2 ring-amber-500/30 shadow-xl'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      {/* Top Meta Line */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {/* Speaking Indicator */}
                          {isBeingSpoken && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center space-x-1 animate-pulse">
                              <Volume2 className="w-3 h-3" />
                              <span>SPEAKING NOW</span>
                            </span>
                          )}

                          {/* Category Badge */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              s.category === 'FACTS'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : s.category === 'RATIO'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : s.category === 'ARGUMENTS'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {s.category}
                          </span>

                          {/* Source Paragraph Link Button */}
                          <span className="text-xs font-mono font-medium text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center space-x-1">
                            <Quote className="w-3 h-3 text-amber-400" />
                            <span>Paragraph {s.sourceParagraphId}</span>
                          </span>
                        </div>

                        {/* Grounded Confidence & Individual TTS Button */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartListen(idx);
                            }}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all ${
                              isBeingSpoken
                                ? 'bg-amber-400 text-slate-950 font-bold'
                                : 'bg-slate-950 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40'
                            }`}
                            title="Read this specific point aloud"
                          >
                            <Volume2 className="w-3 h-3 text-amber-400" />
                            <span>Read Point</span>
                          </button>

                          <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center space-x-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>{s.confidence}% Grounded</span>
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopySentence(s.sentence, s.id);
                            }}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                            title="Copy sentence"
                          >
                            {copiedSentenceId === s.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Main Summary Sentence */}
                      <p className="text-sm font-medium text-white leading-relaxed font-sans">
                        {renderHighlightedText(s.sentence, docSearchQuery)}
                      </p>

                      {/* Excerpt Quote Preview */}
                      {isSelected && s.excerpt && (
                        <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-amber-500/30 text-xs text-amber-200/90 italic font-serif flex items-start space-x-2">
                          <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-sans font-bold text-[10px] text-amber-400 uppercase tracking-wider block not-italic mb-0.5">
                              Source Paragraph Quote Excerpt:
                            </span>
                            "{renderHighlightedText(s.excerpt, docSearchQuery)}"
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Key Takeaways Section */}
                {caseFile.summary?.keyTakeaways?.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Key Judicial Takeaways</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {caseFile.summary.keyTakeaways.map((item, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{renderHighlightedText(item, docSearchQuery)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Citation & Precedent Graph */}
        {activeTab === 'citation' && (
          <div className="h-full p-4 overflow-hidden">
            <PrecedentCitationGraph graph={caseFile.citationGraph} caseTitle={caseFile.title} />
          </div>
        )}

        {/* TAB 3: Case Timeline View */}
        {activeTab === 'timeline' && (
          <div className="h-full overflow-hidden">
            <CaseTimeline
              caseFile={caseFile}
              onSelectParagraph={(paragraphId) => {
                setActiveParagraphId(paragraphId);
                setActiveTab('summary');
              }}
            />
          </div>
        )}

        {/* TAB 4: Auto-Draft Order Sheet */}
        {activeTab === 'order' && (
          <div className="h-full p-4 overflow-y-auto">
            <DraftOrderSheet
              draftOrder={caseFile.draftOrder}
              caseFile={caseFile}
              userRole={userRole}
              onUpdateOrder={onUpdateDraftOrder}
            />
          </div>
        )}

        {/* TAB 5: Case Urgency Triage */}
        {activeTab === 'urgency' && (
          <div className="h-full p-6 overflow-y-auto max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold font-serif text-white">Case Urgency Triage Report</h3>
                  <p className="text-xs text-slate-400">Automated Priority Classification for Judicial Inbox</p>
                </div>
                <UrgencyBadge urgency={caseFile.urgency} size="lg" />
              </div>

              {/* Factors Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${caseFile.urgency.keyFactors.isBailApplication ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <h4 className="font-semibold text-xs uppercase tracking-wider mb-1">Bail / Liberty Application</h4>
                  <p className="text-xs">{caseFile.urgency.keyFactors.isBailApplication ? 'Yes — Involves personal liberty detention under Article 21' : 'No'}</p>
                </div>

                <div className={`p-4 rounded-xl border ${caseFile.urgency.keyFactors.hasMedicalEmergency ? 'bg-red-950/20 border-red-500/40 text-red-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <h4 className="font-semibold text-xs uppercase tracking-wider mb-1">Medical Emergency Status</h4>
                  <p className="text-xs">{caseFile.urgency.keyFactors.hasMedicalEmergency ? 'Critical medical condition documented in hospital annexures' : 'No acute medical emergency'}</p>
                </div>

                <div className={`p-4 rounded-xl border ${caseFile.urgency.keyFactors.isSeniorCitizen ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <h4 className="font-semibold text-xs uppercase tracking-wider mb-1">Senior Citizen Petitioner</h4>
                  <p className="text-xs">{caseFile.urgency.keyFactors.isSeniorCitizen ? 'Yes — Eligible for Senior Citizen Priority Bench' : 'No'}</p>
                </div>

                <div className={`p-4 rounded-xl border ${caseFile.urgency.keyFactors.constitutionalRightsAtStake ? 'bg-purple-950/20 border-purple-500/40 text-purple-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <h4 className="font-semibold text-xs uppercase tracking-wider mb-1">Constitutional Rights Issue</h4>
                  <p className="text-xs">{caseFile.urgency.keyFactors.constitutionalRightsAtStake ? 'Yes — Involves fundamental rights violation' : 'Standard commercial/civil statutory'}</p>
                </div>
              </div>

              {/* Reasons Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">Triage Classification Reasons</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {caseFile.urgency.reasons.map((r, i) => (
                    <li key={i} className="flex items-start space-x-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Judicial Consistency & Fairness Analysis */}
        {activeTab === 'consistency' && (
          <div className="h-full bg-slate-950 overflow-y-auto">
            <ConsistencyAnalysis
              caseFile={caseFile}
              onSelectParagraph={(paragraphId) => {
                setActiveParagraphId(paragraphId);
                setActiveTab('summary');
                setTimeout(() => {
                  const el = paragraphRefs.current[paragraphId];
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              }}
              onUpdateConsistency={(updated) => {
                caseFile.consistencyAnalysis = updated;
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
};
