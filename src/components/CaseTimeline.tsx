import React, { useState } from 'react';
import { CaseFile, CaseTimelineEvent } from '../types';
import {
  Calendar,
  Clock,
  FileText,
  Gavel,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  Filter,
  Search,
  ExternalLink,
  Milestone,
  FileSpreadsheet,
  Send,
  Building2
} from 'lucide-react';

interface CaseTimelineProps {
  caseFile: CaseFile;
  onSelectParagraph?: (paragraphId: number) => void;
}

export const CaseTimeline: React.FC<CaseTimelineProps> = ({
  caseFile,
  onSelectParagraph
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fallback dynamic extraction if timelineEvents is not explicitly provided
  const rawEvents: CaseTimelineEvent[] = React.useMemo(() => {
    if (caseFile.timelineEvents && caseFile.timelineEvents.length > 0) {
      return caseFile.timelineEvents;
    }

    // Auto-generate fallback timeline events from case file data
    const extracted: CaseTimelineEvent[] = [];

    // 1. Initial Filing Event
    if (caseFile.filingDate) {
      extracted.push({
        id: 'evt_filing',
        date: caseFile.filingDate,
        title: 'Petition Filed in Court',
        description: `Bail / Petition filed on behalf of ${caseFile.petitioner} before the ${caseFile.court}.`,
        type: 'FILING',
        sourceParagraphId: 1,
        status: 'COMPLETED'
      });
    }

    // 2. Parse dates from grounded sentences or paragraphs
    caseFile.summary?.sentences?.forEach((sentenceObj, idx) => {
      const match = sentenceObj.sentence.match(/(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i);
      if (match) {
        let evType: CaseTimelineEvent['type'] = 'HEARING';
        const text = sentenceObj.sentence.toLowerCase();
        if (text.includes('arrest') || text.includes('custody')) evType = 'ARREST';
        else if (text.includes('fir') || text.includes('incident')) evType = 'INCIDENT';
        else if (text.includes('medical') || text.includes('report')) evType = 'EVIDENCE';
        else if (text.includes('order') || text.includes('direction')) evType = 'ORDER';

        extracted.push({
          id: `evt_auto_${idx}`,
          date: match[1],
          title: `${sentenceObj.category || 'EVENT'}: ${sentenceObj.sentence.slice(0, 45)}...`,
          description: sentenceObj.sentence,
          type: evType,
          sourceParagraphId: sentenceObj.sourceParagraphId,
          status: 'COMPLETED'
        });
      }
    });

    // 3. Next Hearing Date Event
    if (caseFile.nextHearingDate) {
      extracted.push({
        id: 'evt_next_hearing',
        date: caseFile.nextHearingDate,
        title: 'Scheduled Next Hearing',
        description: `Listed before ${caseFile.judgeBench || caseFile.court} for oral arguments and order compliance.`,
        type: 'HEARING',
        courtLocation: caseFile.court,
        status: 'UPCOMING'
      });
    }

    return extracted;
  }, [caseFile]);

  // Filtered & Sorted Events
  const processedEvents = React.useMemo(() => {
    let result = [...rawEvents];

    // Filter by category
    if (filterType !== 'ALL') {
      result = result.filter((evt) => {
        if (filterType === 'HEARING') return evt.type === 'HEARING' || evt.type === 'ORDER';
        if (filterType === 'ARREST_INCIDENT') return evt.type === 'ARREST' || evt.type === 'INCIDENT';
        if (filterType === 'FILING_EVIDENCE') return evt.type === 'FILING' || evt.type === 'EVIDENCE' || evt.type === 'NOTICES';
        return true;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (evt) =>
          evt.title.toLowerCase().includes(q) ||
          evt.description.toLowerCase().includes(q) ||
          evt.date.toLowerCase().includes(q)
      );
    }

    // Sort chronologically
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return sortOrder === 'ASC' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [rawEvents, filterType, searchQuery, sortOrder]);

  const getEventStyle = (type: CaseTimelineEvent['type']) => {
    switch (type) {
      case 'ARREST':
      case 'INCIDENT':
        return {
          bg: 'bg-red-950/40 border-red-500/40 text-red-400',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
          dotBg: 'bg-red-500',
          icon: <ShieldAlert className="w-4 h-4 text-red-400" />
        };
      case 'ORDER':
        return {
          bg: 'bg-amber-950/40 border-amber-500/40 text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          dotBg: 'bg-amber-400',
          icon: <CheckCircle2 className="w-4 h-4 text-amber-400" />
        };
      case 'HEARING':
        return {
          bg: 'bg-purple-950/40 border-purple-500/40 text-purple-300',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          dotBg: 'bg-purple-500',
          icon: <Gavel className="w-4 h-4 text-purple-400" />
        };
      case 'EVIDENCE':
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          dotBg: 'bg-emerald-400',
          icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
        };
      case 'FILING':
      case 'NOTICES':
      default:
        return {
          bg: 'bg-blue-950/40 border-blue-500/40 text-blue-300',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          dotBg: 'bg-blue-400',
          icon: <FileText className="w-4 h-4 text-blue-400" />
        };
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#08090a] p-4 sm:p-6 overflow-y-auto space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-[#111214] p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Milestone className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-extrabold font-syne text-white">
                Procedural & Chronological Case Timeline
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Sequence of FIR registration, arrests, court filings, orders, and hearing history extracted from case records.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400 font-mono font-bold bg-[#08090a] px-3 py-1.5 rounded-xl border border-white/10">
              Total Milestones: <span className="text-purple-300">{processedEvents.length}</span>
            </span>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterType === 'ALL'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'bg-[#08090a] text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              All Events ({rawEvents.length})
            </button>

            <button
              onClick={() => setFilterType('ARREST_INCIDENT')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterType === 'ARREST_INCIDENT'
                  ? 'bg-red-600 text-white font-bold shadow'
                  : 'bg-[#08090a] text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              Incident & Arrest
            </button>

            <button
              onClick={() => setFilterType('HEARING')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterType === 'HEARING'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'bg-[#08090a] text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              Hearings & Orders
            </button>

            <button
              onClick={() => setFilterType('FILING_EVIDENCE')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterType === 'FILING_EVIDENCE'
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'bg-[#08090a] text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              Filings & Evidence
            </button>
          </div>

          {/* Search & Sort Toggle */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search date or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#08090a] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-sans"
              />
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
              className="px-3 py-1.5 rounded-xl bg-[#08090a] border border-white/10 text-zinc-300 hover:text-white font-mono flex items-center space-x-1 shrink-0"
              title="Toggle Sort Direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
              <span>{sortOrder === 'ASC' ? 'Oldest First' : 'Newest First'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Vertical Timeline Tree View */}
      {processedEvents.length === 0 ? (
        <div className="p-12 text-center bg-[#111214] rounded-2xl border border-white/10 text-zinc-400 space-y-2">
          <AlertCircle className="w-8 h-8 text-zinc-500 mx-auto" />
          <p className="text-sm font-bold">No timeline events matched your filter.</p>
          <p className="text-xs text-zinc-500">Try clearing your search query or selecting 'All Events'.</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3.5 sm:before:left-4.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-blue-500 before:to-emerald-500">
          
          {processedEvents.map((event, index) => {
            const style = getEventStyle(event.type);

            return (
              <div key={event.id || index} className="relative group">
                
                {/* Node Bullet Dot on Vertical Spine */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-3.5 w-4 h-4 rounded-full border-2 border-[#08090a] ${style.dotBg} shadow-lg ring-4 ring-[#08090a] transition-transform group-hover:scale-125 z-10`}
                />

                {/* Main Timeline Card */}
                <div className="bg-[#111214] border border-white/10 hover:border-purple-500/40 rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-300 space-y-3">
                  
                  {/* Card Header: Date & Type Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                    
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${style.badgeBg} border`}>
                        {style.icon}
                      </div>
                      <span className="font-mono font-bold text-sm text-white flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>{event.date}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {event.status === 'UPCOMING' ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1 animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>UPCOMING HEARING</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>RECORDED</span>
                        </span>
                      )}

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${style.badgeBg}`}>
                        {event.type}
                      </span>
                    </div>

                  </div>

                  {/* Card Body: Title & Detailed Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-white font-syne group-hover:text-purple-300 transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {event.description}
                    </p>
                  </div>

                  {/* Card Footer: Court Location & Source Paragraph Jump */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px]">
                    {event.courtLocation ? (
                      <span className="text-zinc-400 flex items-center space-x-1 font-mono">
                        <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{event.courtLocation}</span>
                      </span>
                    ) : (
                      <span className="text-zinc-500 font-mono">Grounding Source: High Court File</span>
                    )}

                    {event.sourceParagraphId && onSelectParagraph && (
                      <button
                        onClick={() => onSelectParagraph(event.sourceParagraphId!)}
                        className="text-purple-400 hover:text-purple-300 font-mono font-semibold flex items-center space-x-1 hover:underline transition-all"
                      >
                        <span>View Source [Paragraph {event.sourceParagraphId}]</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};
