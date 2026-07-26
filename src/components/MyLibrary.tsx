import React, { useState } from 'react';
import { CaseFile, CaseBookmark, UserRole } from '../types';
import { UrgencyBadge } from './UrgencyBadge';
import { generateCaseBriefPDF } from '../utils/pdfExporter';
import {
  Bookmark,
  BookmarkCheck,
  Search,
  Folder,
  FolderPlus,
  Tag,
  Edit3,
  Save,
  Trash2,
  ExternalLink,
  Download,
  Building2,
  Calendar,
  FileText,
  Sparkles,
  ChevronRight,
  Info,
  BookMarked,
  Layers,
  StickyNote,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  Square,
  Play,
  Pause,
  Radio,
  FileAudio,
  Plus
} from 'lucide-react';

interface MyLibraryProps {
  cases: CaseFile[];
  bookmarks: CaseBookmark[];
  onSelectCase: (caseFile: CaseFile) => void;
  onToggleBookmark: (caseId: string) => void;
  onUpdateBookmarkDetails: (caseId: string, folder?: string, notes?: string) => void;
  userRole: UserRole;
}

const DEFAULT_FOLDERS = [
  'All Saved',
  'Bail & Custody',
  'Precedent Research',
  'Constitutional Bench',
  'Drafting Notes'
];

export const MyLibrary: React.FC<MyLibraryProps> = ({
  cases,
  bookmarks,
  onSelectCase,
  onToggleBookmark,
  onUpdateBookmarkDetails,
  userRole
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('All Saved');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');
  const [exportingId, setExportingId] = useState<string | null>(null);

  // Voice Dictation State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTargetId, setRecordingTargetId] = useState<string | null>(null); // caseId or 'SCRATCHPAD'
  const [interimTranscript, setInterimTranscript] = useState('');
  const [dictationLang, setDictationLang] = useState<'en-IN' | 'hi-IN' | 'ta-IN'>('en-IN');
  const [scratchpadNotes, setScratchpadNotes] = useState<string[]>([]);
  const [scratchpadInput, setScratchpadInput] = useState('');
  const [activePlaybackIndex, setActivePlaybackIndex] = useState<number | null>(null);

  const recognitionRef = React.useRef<any>(null);

  // Sample Legal Oral Dictation Templates for quick testing
  const LEGAL_DICTATION_PRESETS = [
    "Grounds for bail verified under Section 439 CrPC. Charge-sheet already completed. Medical report from RML Hospital confirms bi-weekly dialysis.",
    "Cited precedent: Satender Kumar Antil v. CBI (2022) 10 SCC 51 regarding pre-trial incarceration and personal liberty.",
    "Direct prosecution counsel to produce updated status report on shell bank accounts before the next hearing date."
  ];

  // Initialize Speech Recognition
  const startVoiceDictation = (targetId: string) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    setRecordingTargetId(targetId);
    setInterimTranscript('');

    if (!SpeechRecognition) {
      // Fallback if browser SpeechRecognition API isn't present
      setIsRecording(true);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = dictationLang;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setInterimTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsRecording(true);
    }
  };

  const stopVoiceDictation = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsRecording(false);
  };

  const handleApplyDictationToCase = (caseId: string, textToAppend: string) => {
    const currentBm = bookmarkedMap.get(caseId);
    const existing = currentBm?.notes ? currentBm.notes + '\n\n🎙️ [Voice Note]: ' : '🎙️ [Voice Note]: ';
    const updated = existing + textToAppend.trim();
    onUpdateBookmarkDetails(caseId, currentBm?.folder || 'General', updated);
    setInterimTranscript('');
    setRecordingTargetId(null);
    setIsRecording(false);
    if (editingNoteId === caseId) {
      setTempNoteText(updated);
    }
  };

  const handleAddScratchpadVoiceNote = (text: string) => {
    if (!text.trim()) return;
    setScratchpadNotes((prev) => [text.trim(), ...prev]);
    setScratchpadInput('');
    setInterimTranscript('');
    setRecordingTargetId(null);
    setIsRecording(false);
  };

  // Listen back to notes via Text-to-Speech
  const handleSpeakNote = (textToSpeak: string, playbackId: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (activePlaybackIndex === playbackId) {
      setActivePlaybackIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.onend = () => setActivePlaybackIndex(null);
    utterance.onerror = () => setActivePlaybackIndex(null);

    setActivePlaybackIndex(playbackId);
    window.speechSynthesis.speak(utterance);
  };

  // Map bookmarked case IDs to CaseFile objects
  const bookmarkedMap = new Map<string, CaseBookmark>();
  bookmarks.forEach((b) => bookmarkedMap.set(b.caseId, b));

  const bookmarkedCases = cases.filter((c) => bookmarkedMap.has(c.id));

  // Filter bookmarked cases by search & folder
  const filteredCases = bookmarkedCases.filter((c) => {
    const bm = bookmarkedMap.get(c.id);

    // Folder match
    if (selectedFolder !== 'All Saved') {
      if (bm?.folder !== selectedFolder) return false;
    }

    // Keyword Search
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = c.title.toLowerCase().includes(q);
      const matchesNumber = c.caseNumber.toLowerCase().includes(q);
      const matchesParties =
        c.petitioner.toLowerCase().includes(q) || c.respondent.toLowerCase().includes(q);
      const matchesNotes = bm?.notes?.toLowerCase().includes(q) || false;
      return matchesTitle || matchesNumber || matchesParties || matchesNotes;
    }

    return true;
  });

  const handleStartEditNote = (caseId: string, currentNotes: string = '') => {
    setEditingNoteId(caseId);
    setTempNoteText(currentNotes);
  };

  const handleSaveNote = (caseId: string) => {
    const currentBm = bookmarkedMap.get(caseId);
    onUpdateBookmarkDetails(caseId, currentBm?.folder || 'General', tempNoteText);
    setEditingNoteId(null);
  };

  const handleChangeFolder = (caseId: string, newFolder: string) => {
    const currentBm = bookmarkedMap.get(caseId);
    onUpdateBookmarkDetails(caseId, newFolder, currentBm?.notes || '');
  };

  const handleExportPDF = async (c: CaseFile) => {
    setExportingId(c.id);
    try {
      await generateCaseBriefPDF(c, 'en', 'English');
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 text-slate-100">
      
      {/* Top Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <BookMarked className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-white flex items-center space-x-2">
                <span>My Library & Saved Legal Bench Briefs</span>
                <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  {bookmarkedCases.length} Saved
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Personalized collection of bookmarked petitions, precedents, and oral voice dictation notes for rapid courtroom access
              </p>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
              <div className="text-amber-400 font-bold font-mono text-sm">{bookmarkedCases.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Cases</div>
            </div>
            <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
              <div className="text-amber-400 font-bold font-mono text-sm">{scratchpadNotes.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Voice Dictations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Standalone Oral Dictation & Voice Notebook Banner */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Mic className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-white flex items-center space-x-2">
                <span>Courtroom Oral Dictation & Voice Notebook</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Speech-to-Text Live
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Dictate bench observations, oral submissions, or statute citations. Notes are saved alongside your library.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={dictationLang}
              onChange={(e) => setDictationLang(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (हिंदी)</option>
              <option value="ta-IN">Tamil (தமிழ்)</option>
            </select>

            <button
              onClick={() => {
                if (isRecording && recordingTargetId === 'SCRATCHPAD') {
                  stopVoiceDictation();
                } else {
                  startVoiceDictation('SCRATCHPAD');
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow ${
                isRecording && recordingTargetId === 'SCRATCHPAD'
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>
                {isRecording && recordingTargetId === 'SCRATCHPAD' ? 'Recording Dictation...' : 'New Oral Dictation'}
              </span>
            </button>
          </div>
        </div>

        {/* Live Recording Console for Scratchpad */}
        {recordingTargetId === 'SCRATCHPAD' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-red-500/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-red-400 font-bold">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span>Oral Dictation Active ({dictationLang})</span>
              </div>
              <button
                onClick={stopVoiceDictation}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            </div>

            <textarea
              value={interimTranscript || scratchpadInput}
              onChange={(e) => setScratchpadInput(e.target.value)}
              placeholder="Speak now or type dictation text..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-amber-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 min-h-[70px]"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase mr-1">Quick Legal Templates:</span>
                {LEGAL_DICTATION_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setScratchpadInput(p);
                      setInterimTranscript(p);
                    }}
                    className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded px-2 py-0.5"
                  >
                    Preset #{i + 1}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    stopVoiceDictation();
                    setRecordingTargetId(null);
                  }}
                  className="px-3 py-1 rounded-lg text-slate-400 hover:text-white bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddScratchpadVoiceNote(interimTranscript || scratchpadInput || LEGAL_DICTATION_PRESETS[0])}
                  className="px-4 py-1 rounded-lg font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center space-x-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Voice Notebook</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scratchpad Recorded Notes List */}
        {scratchpadNotes.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              Saved Standalone Dictations ({scratchpadNotes.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scratchpadNotes.map((noteText, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2 text-xs"
                >
                  <p className="text-slate-200 leading-relaxed font-sans">{noteText}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                    <span className="flex items-center space-x-1">
                      <FileAudio className="w-3 h-3 text-amber-400" />
                      <span>Oral Record #{scratchpadNotes.length - idx}</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSpeakNote(noteText, idx + 500)}
                        className={`p-1 rounded transition-colors ${
                          activePlaybackIndex === idx + 500
                            ? 'text-amber-400 bg-amber-500/20 animate-pulse'
                            : 'text-slate-400 hover:text-amber-400'
                        }`}
                        title="Read Dictation Aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setScratchpadNotes((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Delete Dictation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls & Folder Tabs Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Folder Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-semibold mr-1 flex items-center">
              <Folder className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Folders:
            </span>
            {DEFAULT_FOLDERS.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFolder(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                  selectedFolder === f
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-950/60 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{f}</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved cases or notes..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Saved Case Cards Grid */}
      {filteredCases.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <BookMarked className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">
            {bookmarkedCases.length === 0 ? 'Your Library is empty' : 'No matching bookmarked cases found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {bookmarkedCases.length === 0
              ? 'Bookmark key legal files from the Case Registry or Grounded Viewer to save them here with personal research notes.'
              : 'Try clearing your folder filter or search query to view all saved items.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCases.map((c) => {
            const bookmarkInfo = bookmarkedMap.get(c.id);
            const isEditing = editingNoteId === c.id;

            return (
              <div
                key={c.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4 group relative"
              >
                {/* Card Header & Remove Button */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="font-mono text-xs font-bold text-amber-400 px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                        {c.caseNumber}
                      </span>
                      <UrgencyBadge urgency={c.urgency} size="sm" />
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onToggleBookmark(c.id)}
                        className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                        title="Remove from My Library"
                      >
                        <BookmarkCheck className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Parties */}
                  <div>
                    <h3
                      onClick={() => onSelectCase(c)}
                      className="text-base font-bold font-serif text-white hover:text-amber-400 cursor-pointer transition-colors leading-snug"
                    >
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {c.petitioner} <strong className="text-slate-500 font-normal">v.</strong> {c.respondent}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1.5">
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{c.court}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Saved: {bookmarkInfo?.bookmarkedAt ? new Date(bookmarkInfo.bookmarkedAt).toLocaleDateString() : 'Recently'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Folder Selector Dropdown */}
                  <div className="flex items-center space-x-2 text-xs bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                    <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-slate-400 text-[11px] font-semibold">Folder:</span>
                    <select
                      value={bookmarkInfo?.folder || 'General'}
                      onChange={(e) => handleChangeFolder(c.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-amber-300 font-medium focus:outline-none focus:border-amber-500"
                    >
                      <option value="General">General</option>
                      <option value="Bail & Custody">Bail & Custody</option>
                      <option value="Precedent Research">Precedent Research</option>
                      <option value="Constitutional Bench">Constitutional Bench</option>
                      <option value="Drafting Notes">Drafting Notes</option>
                    </select>
                  </div>

                  {/* Personal Lawyer/Judge Notes Section */}
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/90 space-y-2.5">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-1">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                        <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                        <span>Bench & Research Notes</span>
                      </span>

                      <div className="flex items-center space-x-1.5">
                        {/* Listen Aloud Button */}
                        {bookmarkInfo?.notes && (
                          <button
                            onClick={() => handleSpeakNote(bookmarkInfo.notes || '', c.id.hashCode ? c.id.hashCode() : 100)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center space-x-1 transition-all ${
                              activePlaybackIndex === (c.id.hashCode ? c.id.hashCode() : 100)
                                ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                            }`}
                            title="Read note aloud"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{activePlaybackIndex === (c.id.hashCode ? c.id.hashCode() : 100) ? 'Playing...' : 'Listen'}</span>
                          </button>
                        )}

                        {/* Dictate Voice Note Button */}
                        <button
                          onClick={() => {
                            if (isRecording && recordingTargetId === c.id) {
                              stopVoiceDictation();
                            } else {
                              startVoiceDictation(c.id);
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 transition-all ${
                            isRecording && recordingTargetId === c.id
                              ? 'bg-red-500 text-white animate-pulse shadow-md'
                              : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                          }`}
                          title="Record oral dictation to note"
                        >
                          <Mic className="w-3 h-3" />
                          <span>
                            {isRecording && recordingTargetId === c.id ? 'Recording...' : 'Dictate Note'}
                          </span>
                        </button>

                        {!isEditing && (
                          <button
                            onClick={() => handleStartEditNote(c.id, bookmarkInfo?.notes)}
                            className="text-slate-400 hover:text-amber-400 text-[11px] flex items-center space-x-1 transition-colors pl-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{bookmarkInfo?.notes ? 'Edit' : 'Text Note'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Active Voice Dictation Overlay for this Card */}
                    {recordingTargetId === c.id && (
                      <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-xl space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 text-red-400 font-bold">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                            <span>Listening to Oral Dictation...</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <select
                              value={dictationLang}
                              onChange={(e) => setDictationLang(e.target.value as any)}
                              className="bg-slate-900 border border-slate-700 rounded text-[10px] text-amber-300 px-1 py-0.5 focus:outline-none"
                            >
                              <option value="en-IN">English (IN)</option>
                              <option value="hi-IN">Hindi (hi-IN)</option>
                              <option value="ta-IN">Tamil (ta-IN)</option>
                            </select>
                            <button
                              onClick={stopVoiceDictation}
                              className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                              title="Stop Dictation"
                            >
                              <Square className="w-3 h-3 fill-slate-300" />
                            </button>
                          </div>
                        </div>

                        {/* Live Transcript Box */}
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs text-amber-200 min-h-[48px] max-h-[90px] overflow-y-auto">
                          {interimTranscript || (
                            <span className="text-slate-500 italic">
                              Speak into your microphone or pick a legal dictation template below...
                            </span>
                          )}
                        </div>

                        {/* Preset legal templates for instant click testing */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Quick Legal Dictation Samples:</span>
                          <div className="flex flex-wrap gap-1">
                            {LEGAL_DICTATION_PRESETS.map((preset, idx) => (
                              <button
                                key={idx}
                                onClick={() => setInterimTranscript(preset)}
                                className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded px-2 py-0.5 text-left truncate max-w-[200px]"
                                title={preset}
                              >
                                + {preset.slice(0, 30)}...
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Save / Apply Dictation Action */}
                        <div className="flex justify-end space-x-2 pt-1 border-t border-red-500/20">
                          <button
                            onClick={() => {
                              stopVoiceDictation();
                              setRecordingTargetId(null);
                            }}
                            className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-white bg-slate-900"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleApplyDictationToCase(c.id, interimTranscript || LEGAL_DICTATION_PRESETS[0])}
                            className="px-3 py-1 rounded text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center space-x-1 shadow"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Dictation to Case</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={tempNoteText}
                          onChange={(e) => setTempNoteText(e.target.value)}
                          placeholder="Type notes (e.g. key precedents to cite, oral arguments summary, list of cited statutes)..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 min-h-[60px]"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-white bg-slate-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNote(c.id)}
                            className="px-3 py-1 rounded text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 flex items-center space-x-1"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save Note</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-300 italic font-sans leading-relaxed whitespace-pre-line">
                        {bookmarkInfo?.notes || (
                          <span className="text-slate-500 not-italic">
                            No notes added yet. Click 'Dictate Note' or 'Text Note' to record court research.
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleExportPDF(c)}
                    disabled={exportingId === c.id}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all flex items-center space-x-1.5"
                    title="Export PDF Brief"
                  >
                    {exportingId === c.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>Export Brief</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSelectCase(c)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-1 shadow"
                  >
                    <span>Open Grounded Viewer</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
