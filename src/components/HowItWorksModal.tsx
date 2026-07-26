import React from 'react';
import { ShieldCheck, AlertTriangle, Link2, Sparkles, CheckCircle2, FileText, ArrowRight, X } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full text-slate-100 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-6 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold font-serif text-white">
                The Grounded Summarization Solution
              </h2>
              <p className="text-xs text-amber-400/90 font-medium">
                Solving the #1 Trust Barrier in Legal AI for Indian Judiciary
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-sm text-slate-300">
          {/* Core Problem Callout */}
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 text-red-200 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-300 text-sm">Why Lawyers & Judges Reject Generic AI Summarizers</h4>
              <p className="text-xs mt-1 leading-relaxed text-red-200/80">
                In a court of law, a hallucinated date, inverted section number, or altered fact can cause miscarriage of justice. Standard LLMs output free-form text with zero proof of origin. Lawyers cannot verify AI claims without re-reading the entire 80-page document.
              </p>
            </div>
          </div>

          {/* Side by Side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Traditional LLM */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center space-x-2 text-red-400 font-semibold text-xs mb-3">
                <X className="w-4 h-4" />
                <span>Generic Legal AI (High Risk)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start space-x-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Generates disconnected summary paragraphs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>No reference links to original petition paragraphs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Requires manual cross-checking of all facts</span>
                </li>
              </ul>
            </div>

            {/* Saakshya Grounded AI */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saakshya Grounded AI (100% Traceable)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Every sentence</strong> links directly to its source paragraph</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>One click</strong> auto-scrolls & highlights exact court text</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Confidence scores (85–99%) for grounded precision</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step by Step Mechanism */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              How Saakshya Grounding Operates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center mb-2">
                  1
                </div>
                <h4 className="font-semibold text-slate-200 text-xs">Paragraph Segmentation</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Court document text is indexed into exact numbered paragraphs (Paragraph 1, 2, 3...).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center mb-2">
                  2
                </div>
                <h4 className="font-semibold text-slate-200 text-xs">Structured Sentence Mapping</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Gemini API produces structured JSON mapping each summary claim to its source paragraph ID and quote excerpt.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center mb-2">
                  3
                </div>
                <h4 className="font-semibold text-slate-200 text-xs">Interactive Side-by-Side Sync</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Clicking any summary sentence triggers live DOM highlight and smooth auto-scroll to the verified source text.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <p className="text-xs text-slate-500">
            Saakshya • Judicial Intelligence Platform for Indian Courts
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400 transition-colors"
          >
            Got It — Launch Demo
          </button>
        </div>

      </div>
    </div>
  );
};
