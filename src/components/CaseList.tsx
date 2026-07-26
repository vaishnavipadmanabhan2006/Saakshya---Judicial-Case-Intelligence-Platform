import React, { useState } from 'react';
import { CaseFile, UrgencyLevel } from '../types';
import { UrgencyBadge } from './UrgencyBadge';
import {
  Search,
  Sparkles,
  Filter,
  FileText,
  Calendar,
  ChevronRight,
  Building2,
  User,
  ArrowUpDown,
  RefreshCw,
  Info,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

interface CaseListProps {
  cases: CaseFile[];
  onSelectCase: (caseFile: CaseFile) => void;
  onNaturalLanguageSearch?: (query: string) => Promise<void>;
  isSearchingAI?: boolean;
  aiSearchExplanation?: string | null;
  bookmarkedIds?: string[];
  onToggleBookmark?: (caseId: string) => void;
}

export const CaseList: React.FC<CaseListProps> = ({
  cases,
  onSelectCase,
  onNaturalLanguageSearch,
  isSearchingAI = false,
  aiSearchExplanation = null,
  bookmarkedIds = [],
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');
  const [caseTypeFilter, setCaseTypeFilter] = useState<string>('ALL');
  const [courtFilter, setCourtFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'URGENCY' | 'DATE' | 'NUMBER'>('URGENCY');
  const [isAiMode, setIsAiMode] = useState(false);

  // Filter & Search Logic
  const filteredCases = cases.filter((c) => {
    // Keyword Search
    const matchesKeyword =
      searchQuery.trim() === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.petitioner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.respondent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.rawText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.keyTakeaways.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.citationGraph.nodes.some((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

    // Urgency Filter
    const matchesUrgency = urgencyFilter === 'ALL' || c.urgency.level === urgencyFilter;

    // Case Type Filter
    const matchesType = caseTypeFilter === 'ALL' || c.caseType === caseTypeFilter;

    // Court Filter
    const matchesCourt = courtFilter === 'ALL' || c.court === courtFilter;

    return matchesKeyword && matchesUrgency && matchesType && matchesCourt;
  });

  // Sorting Logic
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (sortBy === 'URGENCY') {
      return b.urgency.score - a.urgency.score;
    }
    if (sortBy === 'DATE') {
      return new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime();
    }
    return a.caseNumber.localeCompare(b.caseNumber);
  });

  // Handle AI Search Submit
  const handleAiSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !onNaturalLanguageSearch) return;
    setIsAiMode(true);
    await onNaturalLanguageSearch(searchQuery);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 text-slate-100">
      
      {/* Top Search & Filter Bar */}
      <div className="bg-[#111214] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 backdrop-blur-xl">
        
        {/* Search Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold font-syne text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <span>Judicial Case Index & Triage Docket</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Grounded search across petitions, judgments, statutory sections, and precedent citation graphs
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-zinc-400 font-mono text-[11px]">Sort Order:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#08090a] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500 shadow"
            >
              <option value="URGENCY">Urgency Triage Score (High to Low)</option>
              <option value="DATE">Filing Date (Newest First)</option>
              <option value="NUMBER">Case Number</option>
            </select>
          </div>
        </div>

        {/* Natural Language AI Search Bar */}
        <form onSubmit={handleAiSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-3.5 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Case Law, Precedents, or Dockets (e.g. 'bail applications involving senior citizen medical grounds')..."
              className="w-full bg-[#08090a] border border-white/10 rounded-xl pl-11 pr-32 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 shadow-inner font-sans"
            />
            <button
              type="submit"
              disabled={isSearchingAI}
              className="absolute right-2 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center space-x-1.5 shadow-md shadow-purple-900/50"
            >
              {isSearchingAI ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>AI Search</span>
            </button>
          </div>
        </form>

        {/* AI Search Explanation Callout */}
        {aiSearchExplanation && (
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-purple-300 font-mono">AI Search Intent Analysis: </span>
              {aiSearchExplanation}
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
          
          {/* Urgency Filter */}
          <div className="flex flex-wrap items-center space-x-1">
            <span className="text-zinc-400 font-mono text-[11px] mr-1 flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
              Priority:
            </span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((u) => (
              <button
                key={u}
                onClick={() => setUrgencyFilter(u)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                  urgencyFilter === u
                    ? u === 'CRITICAL'
                      ? 'bg-red-500 text-white shadow'
                      : u === 'HIGH'
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-zinc-800 text-purple-300 shadow'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Case Type Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-zinc-400 font-mono text-[11px]">Type:</span>
            <select
              value={caseTypeFilter}
              onChange={(e) => setCaseTypeFilter(e.target.value)}
              className="bg-[#08090a] border border-white/10 rounded-lg px-2 py-1 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="ALL">All Case Types</option>
              <option value="BAIL_APPLICATION">Bail Application</option>
              <option value="WRIT_PETITION">Writ Petition</option>
              <option value="CRIMINAL_APPEAL">Criminal Appeal</option>
              <option value="ARBITRATION_APPEAL">Arbitration Appeal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Case List Grid / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1 font-mono">
          <span>Showing <strong className="text-white">{sortedCases.length}</strong> judicial cases</span>
          <span>Click case to open Analysis Portal</span>
        </div>

        {sortedCases.length === 0 ? (
          <div className="bg-[#111214] border border-white/10 rounded-2xl p-12 text-center text-zinc-500">
            <Info className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm font-medium">No cases match your filter criteria.</p>
            <p className="text-xs mt-1 font-mono">Try resetting search query or priority filter.</p>
          </div>
        ) : (
          sortedCases.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c)}
              className="bg-[#111214] hover:bg-[#16181c] border border-white/10 hover:border-purple-500/50 rounded-2xl p-5 shadow-xl transition-all duration-300 cursor-pointer group space-y-4 relative"
            >
              {/* Card Top Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-purple-400 px-2.5 py-1 rounded bg-[#08090a] border border-white/10">
                    {c.caseNumber}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{c.court}</span>
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center space-x-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Filed: {c.filingDate}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <UrgencyBadge urgency={c.urgency} size="sm" />
                  <span className="text-xs font-mono font-bold text-zinc-400 bg-[#08090a] px-2 py-0.5 rounded border border-white/10">
                    Score: {c.urgency.score}
                  </span>

                  {onToggleBookmark && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(c.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-all ${
                        bookmarkedIds.includes(c.id)
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow'
                          : 'bg-[#08090a] text-zinc-400 hover:text-white border-white/10 hover:border-white/20'
                      }`}
                      title={bookmarkedIds.includes(c.id) ? 'Remove bookmark' : 'Bookmark to My Library'}
                    >
                      {bookmarkedIds.includes(c.id) ? (
                        <BookmarkCheck className="w-4 h-4 fill-purple-400 text-purple-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Parties */}
              <div>
                <h3 className="text-lg font-extrabold font-syne text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                  <span>{c.title}</span>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  {c.petitioner} <strong className="text-zinc-500 font-normal">v.</strong> {c.respondent}
                </p>
              </div>

              {/* Key Takeaways Preview */}
              {c.summary?.keyTakeaways?.length > 0 && (
                <div className="bg-[#08090a]/80 p-3 rounded-xl border border-white/5 text-xs text-zinc-300 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-purple-400 tracking-wider block mb-0.5">
                    Grounded AI Takeaways ({c.summary.sentences.length} Sentences Traced)
                  </span>
                  <p className="line-clamp-2 text-zinc-300 leading-relaxed font-sans">
                    {c.summary.keyTakeaways.join(' • ')}
                  </p>
                </div>
              )}

              {/* Bottom Citations & Actions Pill */}
              <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase">Cited Laws:</span>
                  {c.citationGraph.nodes
                    .filter((n) => n.id !== 'CURRENT_CASE')
                    .slice(0, 3)
                    .map((n, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#08090a] text-zinc-300 border border-white/10">
                        {n.title}
                      </span>
                    ))}
                </div>

                <div className="text-purple-400 text-xs font-semibold flex items-center space-x-1 group-hover:underline">
                  <span>Open Analysis Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};
