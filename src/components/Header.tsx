import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  Scale,
  Shield,
  FileText,
  BarChart3,
  HelpCircle,
  PlusCircle,
  UserCheck,
  Search,
  Sparkles,
  BookOpen,
  BookMarked,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  users: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  activeTab: 'cases' | 'viewer' | 'analytics' | 'library' | 'pitch';
  setActiveTab: (tab: 'cases' | 'viewer' | 'analytics' | 'library' | 'pitch') => void;
  onOpenUploadModal: () => void;
  onOpenHowItWorks: () => void;
  selectedCaseTitle?: string;
  bookmarkCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  users,
  onSwitchUser,
  activeTab,
  setActiveTab,
  onOpenUploadModal,
  onOpenHowItWorks,
  selectedCaseTitle,
  bookmarkCount = 0
}) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('saakshya_theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('saakshya_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };
  return (
    <header className="bg-[#08090a]/90 border-b border-white/10 text-white sticky top-0 z-40 backdrop-blur-xl shadow-2xl">
      {/* Top Judicial Bench Bar */}
      <div className="bg-[#0b0c0e]/95 px-4 py-1.5 text-xs border-b border-white/5 flex flex-wrap justify-between items-center text-zinc-400">
        <div className="flex items-center space-x-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
            v2.4 JUDICIAL ENGINE
          </span>
          <span className="hidden sm:inline text-zinc-400 text-[11px] font-medium">
            Supreme Court & High Court Bench Portal • Grounded Traceability
          </span>
        </div>
        
        {/* Bench Mode & Role Selector */}
        <div className="flex items-center space-x-3">
          <span className="text-zinc-400 font-mono text-[11px] hidden md:inline">Bench Mode: <strong className="text-white font-semibold">{currentUser.name}</strong></span>
          <div className="flex items-center space-x-1 bg-[#111214] p-0.5 rounded-lg border border-white/10">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => onSwitchUser(u)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] transition-all font-semibold flex items-center space-x-1 ${
                  currentUser.id === u.id
                    ? u.role === 'JUDGE'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 border border-purple-400/40'
                      : u.role === 'LAWYER'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-blue-400/40'
                      : 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/40'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{u.role === 'JUDGE' ? '⚖️' : u.role === 'LAWYER' ? '📜' : '📋'}</span>
                <span>{u.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Syne Typography */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('cases')}>
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-400 transition-all duration-300 shadow-lg shadow-purple-950/50">
            <Scale className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold font-syne tracking-tight text-white flex items-center">
                <span>Saakshya</span>
                <span className="text-amber-400 ml-2 font-mono text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md font-semibold">
                  साक्ष्य
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans tracking-wide">
              Judicial Intelligence & Precedent Engine
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 bg-[#111214] p-1.5 rounded-2xl border border-white/10 shadow-2xl">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'cases'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/80 font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Case Index</span>
          </button>

          <button
            onClick={() => setActiveTab('viewer')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 relative ${
              activeTab === 'viewer'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/80 font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'viewer' ? 'text-white' : 'text-purple-400'}`} />
            <span>Analysis Portal</span>
            {selectedCaseTitle && (
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'library'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/80 font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookMarked className={`w-4 h-4 ${activeTab === 'library' ? 'text-white' : 'text-amber-400'}`} />
            <span>My Library</span>
            {bookmarkCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono ${
                activeTab === 'library' ? 'bg-white text-purple-950' : 'bg-purple-500 text-white'
              }`}>
                {bookmarkCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/80 font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Court Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'pitch'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/80 font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Why Grounding</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* High-Contrast Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 text-xs font-semibold bg-[#111214] hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center space-x-1.5 shadow text-amber-300 hover:text-amber-200"
            title={theme === 'dark' ? 'Switch to Courtroom High-Contrast Light Mode' : 'Switch to Bench Dark Mode'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-zinc-200">Courtroom Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline text-zinc-200">Bench Dark</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-[#111214] hover:bg-white/5 border border-white/10 rounded-xl transition-all flex items-center space-x-1.5 shadow"
            title="Learn why grounded sentence tracing solves legal AI hallucinations"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Traceability?</span>
          </button>

          <button
            onClick={onOpenUploadModal}
            className="px-4 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 transition-all flex items-center space-x-1.5 transform active:scale-95 border border-purple-400/30"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Case</span>
          </button>
        </div>
      </div>
    </header>
  );
};
