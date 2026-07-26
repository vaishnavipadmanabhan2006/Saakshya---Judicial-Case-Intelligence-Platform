import React from 'react';
import { Scale, ShieldCheck, Zap, Network, Gavel, Languages, ArrowRight, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

interface PitchBannerProps {
  onStartDemo: () => void;
}

export const PitchBanner: React.FC<PitchBannerProps> = ({ onStartDemo }) => {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8 text-slate-100">
      
      {/* Pitch Hero Callout */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-6">
        
        <div className="flex items-center space-x-3">
          <span className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Scale className="w-8 h-8 stroke-[2.2]" />
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                CORE DIFFERENTIATOR
              </span>
              <span className="text-xs text-slate-400 font-sans">Hackathon Demonstration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white mt-1">
              Saakshya: Grounded Summarization for Indian Judiciary
            </h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl font-sans">
          Existing legal AI tools fail in courts because lawyers do not trust hallucinated summaries.
          Saakshya introduces <strong className="text-amber-400">Grounded Sentence-to-Paragraph Tracing</strong>: every summary claim links directly to its source paragraph in the original petition with side-by-side interactive highlighting.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            onClick={onStartDemo}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-xl flex items-center space-x-2 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>Launch Interactive Grounded Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature Grid Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Grounded Tracing */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit border border-amber-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-serif text-white">1. Sentence-to-Paragraph Tracing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Clicking any summary sentence automatically scrolls to and highlights the exact supporting paragraph in the left split-screen document viewer.
          </p>
        </div>

        {/* Priority Triage */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400 w-fit border border-red-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-serif text-white">2. Urgent Case Triage Inbox</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI automatically classifies uploaded cases into Critical, High, Medium, or Low priority based on bail detention, senior citizen status, and medical emergencies.
          </p>
        </div>

        {/* Precedent Citation Graph */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 w-fit border border-blue-500/20">
            <Network className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-serif text-white">3. Precedent Citation Graph</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Interactive node graph linking current case facts to binding IPC, CrPC, BNS statutory sections and landmark Supreme Court rulings.
          </p>
        </div>

        {/* Multi-Language Summaries */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/20">
            <Languages className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-serif text-white">4. Multi-Language Court Summaries</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instant translation into Hindi, Tamil, Telugu, Bengali, and Marathi while preserving sentence-level paragraph traceability!
          </p>
        </div>

        {/* Auto-Draft Order Sheet */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit border border-purple-500/20">
            <Gavel className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-serif text-white">5. Auto-Draft Order Sheet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Judge-assist order template generator clearly stamped for judicial review, editing, digital signature, and export.
          </p>
        </div>

        {/* Court Analytics */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit border border-amber-500/20">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-serif text-white">6. Registry Analytics Dashboard</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            High-level metrics on backlog trends, average briefing speed, urgency distribution, and top cited statutory provisions.
          </p>
        </div>

      </div>
    </div>
  );
};
