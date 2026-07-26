import React, { useState } from 'react';
import { CaseFile, JudicialConsistencyAnalysis, PrecedentComparison, GroundedFactorComparison } from '../types';
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileText,
  Clock,
  BookOpen,
  ArrowRight,
  Info,
  Check
} from 'lucide-react';

interface ConsistencyAnalysisProps {
  caseFile: CaseFile;
  onSelectParagraph?: (paragraphId: number) => void;
  onUpdateConsistency?: (updatedAnalysis: JudicialConsistencyAnalysis) => void;
}

export const ConsistencyAnalysis: React.FC<ConsistencyAnalysisProps> = ({
  caseFile,
  onSelectParagraph,
  onUpdateConsistency
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPrecedent, setSelectedPrecedent] = useState<PrecedentComparison | null>(null);

  const analysis: JudicialConsistencyAnalysis | undefined = caseFile.consistencyAnalysis;

  const handleRefreshAnalysis = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('/api/check-consistency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseFile })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.consistencyAnalysis && onUpdateConsistency) {
          onUpdateConsistency(data.consistencyAnalysis);
        }
      }
    } catch (err) {
      console.error('Failed to refresh consistency analysis:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!analysis) {
    return (
      <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 m-6 text-zinc-300">
        <Scale className="w-12 h-12 text-amber-400 mx-auto mb-3 animate-pulse" />
        <h3 className="text-lg font-bold text-white mb-2">No Consistency Data Computed</h3>
        <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6">
          Compare this open case against extracted precedents and citations from past decisions.
        </p>
        <button
          onClick={handleRefreshAnalysis}
          disabled={isRefreshing}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2 mx-auto shadow-lg transition-all"
        >
          {isRefreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Compute Consistency & Fairness Analysis</span>
        </button>
      </div>
    );
  }

  const score = analysis.consistencyScore;
  const scoreColor =
    score >= 85
      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
      : score >= 70
      ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
      : 'text-rose-400 border-rose-500/30 bg-rose-500/10';

  const scoreGaugeBg =
    score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
      {/* Top Header & Re-analyze Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-inner">
            <Scale className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold text-white tracking-tight font-syne">
                Consistency & Fairness Analysis
              </h2>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Judicial AI Grounded
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Automated precedent alignment & equity benchmark for <strong className="text-zinc-200">{caseFile.title}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleRefreshAnalysis}
          disabled={isRefreshing}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-zinc-200 font-semibold text-xs border border-slate-700 shadow flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          <span>{isRefreshing ? 'Analyzing Precedents...' : 'Re-run Analysis'}</span>
        </button>
      </div>

      {/* OUTLIER ALERT BANNER (If flagged) */}
      {analysis.isOutlier && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 text-amber-100 shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start space-x-4">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 stroke-[2.5] animate-bounce" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-amber-300 uppercase tracking-wide flex items-center space-x-2">
                  <span>{analysis.outlierLabel || '⚠ Review for Consistency'}</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-200 font-bold">
                  Human Judicial Review Prompt
                </span>
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
                {analysis.outlierReason || analysis.explanation}
              </p>
              <div className="pt-2 flex items-center space-x-2 text-[11px] text-amber-300/80 italic font-mono">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Notice: This flag is not a critique or decision, but a prompt for human judicial review to foster equal treatment under similar legal circumstances.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN METRIC & EXPLANATION CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Consistency Score Gauge Card (4/12) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Consistency Score
              </span>
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${scoreColor}`}>
                {analysis.alignmentStatus.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-baseline space-x-2 my-2">
              <span className="text-5xl font-black text-white font-syne tracking-tight">
                {score}%
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                precedent alignment
              </span>
            </div>

            {/* Score Bar */}
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5 my-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${scoreGaugeBg}`}
                style={{ width: `${score}%` }}
              />
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mt-3">
              Evaluates current case claims, custody timeline, and statutory provisions against comparable past rulings in the registry.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grounded Model</span>
            </span>
            <span>{analysis.similarPrecedents?.length || 0} Precedents Matched</span>
          </div>
        </div>

        {/* Plain-English Explanation Card (8/12) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Plain-English Judicial Rationale
              </h3>
            </div>

            <p className="text-sm text-zinc-200 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 font-sans shadow-inner">
              "{analysis.explanation}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Offense Match</span>
              <span className="text-xs font-semibold text-zinc-200 mt-0.5 block">High Statutory Overlap</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Custody Comparison</span>
              <span className="text-xs font-semibold text-zinc-200 mt-0.5 block">
                {analysis.isOutlier ? 'Exceeds Benchmark Avg' : 'Within Benchmark Range'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Precedent Directness</span>
              <span className="text-xs font-semibold text-amber-400 mt-0.5 block">Traceable Citations</span>
            </div>
          </div>
        </div>
      </div>

      {/* GROUNDED FACTOR COMPARISON MATRIX */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Factor-by-Factor Legal Grounding Matrix
            </h3>
          </div>
          <span className="text-xs text-zinc-400">
            Click any factor to jump to its source paragraph in the petition
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.groundedFactors?.map((factor: GroundedFactorComparison, idx: number) => {
            const badgeStyle =
              factor.status === 'PARITY'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : factor.status === 'DISPARITY'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-sky-500/10 text-sky-400 border-sky-500/30';

            return (
              <div
                key={idx}
                onClick={() => factor.sourceParagraphId && onSelectParagraph && onSelectParagraph(factor.sourceParagraphId)}
                className={`p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-purple-500/40 transition-all ${
                  factor.sourceParagraphId ? 'cursor-pointer group' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors flex items-center space-x-2">
                    <span>{factor.factor}</span>
                    {factor.sourceParagraphId && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                        Para {factor.sourceParagraphId}
                      </span>
                    )}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeStyle}`}>
                    {factor.status}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {factor.details}
                </p>

                {factor.comparedCaseRef && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center text-[11px] text-zinc-400 space-x-1 font-mono">
                    <span className="text-zinc-500">Benchmark Ref:</span>
                    <span className="text-amber-400 font-medium">{factor.comparedCaseRef}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SIMILAR PAST PRECEDENTS TABLE */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Extracted Benchmark Precedents & Past Cases
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {analysis.similarPrecedents?.length || 0} Cases Compared
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {analysis.similarPrecedents?.map((prec: PrecedentComparison, idx: number) => (
            <div
              key={prec.caseId || idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-amber-500/30 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      {prec.caseNumber}
                    </span>
                    <span className="text-xs text-zinc-400">• {prec.court}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white mt-1">
                    {prec.caseTitle}
                  </h4>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <span className="text-xs font-bold text-zinc-400 block">Similarity</span>
                    <span className="text-sm font-black text-emerald-400 font-syne">
                      {prec.similarityScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Offense Badges & Outcome */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {prec.offenseSections?.map((sec, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-zinc-300 border border-slate-800"
                  >
                    {sec}
                  </span>
                ))}

                {prec.custodyPeriod && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    <span>Custody: {prec.custodyPeriod}</span>
                  </span>
                )}

                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 ml-auto">
                  {prec.outcome}
                </span>
              </div>

              {/* Parity/Divergence Note */}
              <p className="text-xs text-zinc-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 leading-relaxed font-sans">
                <strong className="text-amber-400 font-medium">Key Comparison: </strong>
                {prec.keyDivergenceOrParity}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
