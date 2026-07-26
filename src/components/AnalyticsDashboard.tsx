import React from 'react';
import { CourtAnalytics } from '../types';
import { BarChart3, TrendingUp, Clock, Scale, AlertOctagon, CheckCircle2, Shield, Building2, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface AnalyticsDashboardProps {
  analytics: CourtAnalytics;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111214] border border-white/10 p-3 rounded-xl shadow-2xl space-y-1.5 text-xs backdrop-blur-md">
        <p className="font-bold text-white font-mono border-b border-white/10 pb-1">{label} 2026</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between space-x-4">
            <span style={{ color: entry.color }} className="font-semibold capitalize font-mono text-[11px]">
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  const maxCitedCount = Math.max(...analytics.topCitedSections.map((s) => s.count));

  const urgencyTrendData = analytics.urgencyMonthlyTrend || [
    { month: 'Jan', critical: 780, high: 6200, medium: 22100, low: 38900 },
    { month: 'Feb', critical: 890, high: 6800, medium: 23800, low: 40200 },
    { month: 'Mar', critical: 960, high: 7100, medium: 25100, low: 41800 },
    { month: 'Apr', critical: 1040, high: 7500, medium: 26400, low: 42900 },
    { month: 'May', critical: 1110, high: 7900, medium: 27500, low: 43800 },
    { month: 'Jun', critical: 1180, high: 8200, medium: 28400, low: 44600 },
    { month: 'Jul', critical: 1240, high: 8450, medium: 29120, low: 45400 }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 text-slate-100">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111214] p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-extrabold font-syne text-white">Court Registry Analytics & Backlog Intelligence</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time court performance metrics for High Court Registry & Judicial Administration
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#08090a] border border-white/10 text-zinc-300">
            <span className="text-zinc-500 mr-1">System Load:</span>
            <span className="font-bold text-emerald-400">Optimal (99.8%)</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#08090a] border border-white/10 text-zinc-300">
            <span className="text-zinc-500 mr-1">AI Speed:</span>
            <span className="font-bold text-purple-300">{analytics.avgSummaryTimeMinutes} mins / file</span>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pending */}
        <div className="p-5 rounded-2xl bg-[#111214] border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="uppercase font-semibold tracking-wider font-mono text-[11px]">Total Pending Backlog</span>
            <Scale className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            {analytics.totalPendingCases.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>-2.4% reduction via Grounded AI Triage</span>
          </div>
        </div>

        {/* Avg Time to Summary */}
        <div className="p-5 rounded-2xl bg-[#111214] border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="uppercase font-semibold tracking-wider font-mono text-[11px]">Avg Case Briefing Time</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-purple-300">
            2.4 <span className="text-sm font-normal text-zinc-400">mins</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            vs 180 mins traditional manual read
          </div>
        </div>

        {/* Critical Urgency Queue */}
        <div className="p-5 rounded-2xl bg-[#111214] border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="uppercase font-semibold tracking-wider font-mono text-[11px]">Critical Priority Cases</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-red-400">
            {analytics.urgencyBreakdown.critical.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-zinc-400">
            Bail, Senior Citizen & Medical Emergencies
          </div>
        </div>

        {/* Average Pendency */}
        <div className="p-5 rounded-2xl bg-[#111214] border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="uppercase font-semibold tracking-wider font-mono text-[11px]">High Court Pendency</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            340 <span className="text-sm font-normal text-zinc-400">days avg</span>
          </div>
          <div className="text-[11px] text-emerald-400">
            Delhi High Court Bench Target
          </div>
        </div>
      </div>

      {/* NEW: Case Urgency Classification Trend Chart (Recharts) */}
      <div className="p-6 rounded-2xl bg-[#111214] border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-syne flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Case Urgency Classification Trend Over Time</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Monthly distribution trajectory of cases triaged into Critical, High, Medium, and Low urgency tiers (Recharts Engine)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono bg-[#08090a] px-3 py-1.5 rounded-xl border border-white/10">
            <span className="flex items-center text-red-400"><span className="w-2.5 h-2.5 rounded-full bg-red-400 mr-1.5"></span> Critical</span>
            <span className="flex items-center text-purple-300"><span className="w-2.5 h-2.5 rounded-full bg-purple-400 mr-1.5"></span> High</span>
            <span className="flex items-center text-blue-400"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 mr-1.5"></span> Medium</span>
            <span className="flex items-center text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1.5"></span> Low</span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={urgencyTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c084fc" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#c084fc" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} tickLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="low" name="Low Priority" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorLow)" />
              <Area type="monotone" dataKey="medium" name="Medium Priority" stroke="#60a5fa" strokeWidth={2} fillOpacity={1} fill="url(#colorMedium)" />
              <Area type="monotone" dataKey="high" name="High Priority" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#colorHigh)" />
              <Area type="monotone" dataKey="critical" name="Critical Priority" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCritical)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Top Cited Statutory Provisions Bar Chart (7/12) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#111214] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-syne">Top Cited Laws & Sections</h3>
              <p className="text-xs text-zinc-400">Most referenced statutory sections across system petitions</p>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              IPC / CrPC / BNS / BNSS
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {analytics.topCitedSections.map((item, idx) => {
              const percentage = Math.round((item.count / maxCitedCount) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-zinc-200">{item.section}</span>
                    <span className="font-mono text-purple-300 font-bold">{item.count.toLocaleString('en-IN')} cases</span>
                  </div>

                  <div className="h-2.5 w-full bg-[#08090a] rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="text-[10px] text-zinc-500 font-mono">
                    Act: {item.act}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Urgency Distribution & Monthly Backlog Trend (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Urgency Breakdown */}
          <div className="p-6 rounded-2xl bg-[#111214] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3 font-syne">
              Case Urgency Triage Distribution
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-800/40">
                <div className="text-[10px] text-red-300 uppercase font-semibold font-mono">Critical Priority</div>
                <div className="text-lg font-bold font-mono text-red-400">{analytics.urgencyBreakdown.critical.toLocaleString()}</div>
                <div className="text-[10px] text-zinc-400 mt-1">Bail / Medical / Art 21</div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40">
                <div className="text-[10px] text-purple-300 uppercase font-semibold font-mono">High Priority</div>
                <div className="text-lg font-bold font-mono text-purple-300">{analytics.urgencyBreakdown.high.toLocaleString()}</div>
                <div className="text-[10px] text-zinc-400 mt-1">Senior Citizen / Stay</div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-800/40">
                <div className="text-[10px] text-blue-300 uppercase font-semibold font-mono">Medium Hearing</div>
                <div className="text-lg font-bold font-mono text-blue-400">{analytics.urgencyBreakdown.medium.toLocaleString()}</div>
                <div className="text-[10px] text-zinc-400 mt-1">Regular Appeals</div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                <div className="text-[10px] text-emerald-300 uppercase font-semibold font-mono">Low Priority</div>
                <div className="text-lg font-bold font-mono text-emerald-400">{analytics.urgencyBreakdown.low.toLocaleString()}</div>
                <div className="text-[10px] text-zinc-400 mt-1">Routine Civil / Compliance</div>
              </div>
            </div>
          </div>

          {/* Court Wise Breakdown Table */}
          <div className="p-6 rounded-2xl bg-[#111214] border border-white/10 shadow-xl space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3 font-syne">
              Participating High Court Benches
            </h3>

            <div className="space-y-2 text-xs">
              {analytics.courtPendency.map((c, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 rounded-lg bg-[#08090a] border border-white/10">
                  <div>
                    <span className="font-semibold text-white block">{c.court}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Avg {c.avgDaysPending} days pendency</span>
                  </div>
                  <span className="font-mono text-purple-300 font-bold">{c.count.toLocaleString('en-IN')} cases</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
