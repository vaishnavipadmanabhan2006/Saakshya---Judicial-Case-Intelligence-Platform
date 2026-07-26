import React, { useState } from 'react';
import { CaseFile, DraftOrder, UserRole } from '../types';
import { Gavel, CheckCircle2, ShieldAlert, Download, Edit3, Save, Printer, Lock, Calendar, FileCheck, Stamp, Loader2 } from 'lucide-react';
import { generateDraftOrderPDF } from '../utils/pdfExporter';
import { VoiceDictationBar } from './VoiceDictationBar';

interface DraftOrderSheetProps {
  draftOrder: DraftOrder;
  caseFile?: CaseFile;
  userRole: UserRole;
  onUpdateOrder?: (updatedOrder: DraftOrder) => void;
}

export const DraftOrderSheet: React.FC<DraftOrderSheetProps> = ({
  draftOrder,
  caseFile,
  userRole,
  onUpdateOrder
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [orderText, setOrderText] = useState(draftOrder.orderText);
  const [nextDate, setNextDate] = useState(draftOrder.nextHearingDate);
  const [judgeNotes, setJudgeNotes] = useState(draftOrder.judgeNotes || '');
  const [isApproved, setIsApproved] = useState(draftOrder.status === 'APPROVED');
  const [approvedAt, setApprovedAt] = useState(draftOrder.approvedAt || '');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [dictationTarget, setDictationTarget] = useState<'notes' | 'orderText'>('notes');

  const canApprove = userRole === 'JUDGE';

  const handleAppendDictation = (text: string, target: 'notes' | 'orderText') => {
    if (!text) return;
    if (target === 'notes') {
      setJudgeNotes((prev) => (prev ? prev + '\n' + text : text));
    } else {
      setOrderText((prev) => (prev ? prev + '\n\n' + text : text));
      setIsEditing(true); // Automatically open edit view if dictating into order text body
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const fallbackCaseFile: CaseFile = caseFile || {
        id: draftOrder.caseId || 'CASE-2026-001',
        caseNumber: draftOrder.id || 'HC/ND/2026/0491',
        title: draftOrder.title,
        petitioner: 'Petitioner Party',
        respondent: 'Respondent Party',
        court: draftOrder.courtName,
        filingDate: '2026-01-15',
        caseType: 'CRIMINAL_APPEAL',
        status: isApproved ? 'DISPOSED' : 'PENDING',
        rawText: '',
        paragraphs: [],
        summary: { sentences: [], keyTakeaways: [], proceduralHistory: '' },
        urgency: { level: 'HIGH', score: 85, reasons: [], keyFactors: { isBailApplication: false, hasMedicalEmergency: false, isSeniorCitizen: false, isLimitationExpiring: false, constitutionalRightsAtStake: true } },
        citationGraph: { nodes: [], edges: [] },
        draftOrder: draftOrder,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'High Court Registry'
      };

      const currentOrder: DraftOrder = {
        ...draftOrder,
        orderText,
        nextHearingDate: nextDate,
        judgeNotes,
        status: isApproved ? 'APPROVED' : 'DRAFT',
        approvedAt: approvedAt || draftOrder.approvedAt
      };

      await generateDraftOrderPDF(currentOrder, fallbackCaseFile, (status) => setExportStatus(status));
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsExporting(false);
      setExportStatus('');
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    const updated: DraftOrder = {
      ...draftOrder,
      orderText,
      nextHearingDate: nextDate,
      judgeNotes,
      status: isApproved ? 'APPROVED' : 'DRAFT'
    };
    if (onUpdateOrder) onUpdateOrder(updated);
  };

  const handleApprove = () => {
    if (!canApprove) return;
    const now = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    setIsApproved(true);
    setApprovedAt(now);

    const updated: DraftOrder = {
      ...draftOrder,
      orderText,
      nextHearingDate: nextDate,
      judgeNotes,
      status: 'APPROVED',
      approvedBy: 'Hon\'ble Justice R. S. Sharma',
      approvedAt: now
    };
    if (onUpdateOrder) onUpdateOrder(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Prominent Judicial Disclaimer Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
        isApproved
          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
          : 'bg-amber-950/30 border-amber-500/50 text-amber-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-lg ${isApproved ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'}`}>
            {isApproved ? <Stamp className="w-5 h-5 stroke-[2.5]" /> : <ShieldAlert className="w-5 h-5 stroke-[2.5]" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold uppercase tracking-wider text-xs px-2 py-0.5 rounded bg-slate-950 border border-current">
                {isApproved ? 'APPROVED JUDICIAL ORDER' : 'AI DRAFT — REQUIRES JUDICIAL REVIEW'}
              </span>
              <span className="text-xs opacity-80 font-mono">
                {isApproved ? `Approved on ${approvedAt}` : 'Not Official Until Signed By Judge'}
              </span>
            </div>
            <p className="text-xs mt-1 opacity-90">
              {isApproved
                ? 'This order has been reviewed, edited, and officially approved by the Sitting Bench.'
                : 'Generated by Saakshya Engine based on petition arguments & precedents. Must be reviewed by Judicial Officer.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {canApprove && !isApproved && (
            <button
              onClick={handleApprove}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign & Approve Order</span>
            </button>
          )}

          {!canApprove && !isApproved && (
            <div className="px-3 py-1.5 rounded bg-slate-950 text-slate-400 text-xs font-mono flex items-center space-x-1 border border-slate-800">
              <Lock className="w-3.5 h-3.5" />
              <span>Judge Approval Required</span>
            </div>
          )}

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-amber-600/50 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
            title="Download formatted PDF document"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{exportStatus || 'Generating PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Print / Save Page"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Dictation Component */}
      <VoiceDictationBar
        onAppendText={handleAppendDictation}
        targetField={dictationTarget}
        setTargetField={setDictationTarget}
        disabled={isApproved}
      />

      {/* Main Order Sheet Formal Paper Layout */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 text-slate-100 font-serif relative overflow-hidden">
        
        {/* Judicial Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Gavel className="w-96 h-96 text-amber-500" />
        </div>

        {/* Court Header */}
        <div className="text-center space-y-1 border-b border-slate-800 pb-6 relative z-10">
          <h2 className="text-lg font-bold tracking-widest text-amber-400 font-serif uppercase">
            {draftOrder.courtName}
          </h2>
          <p className="text-xs text-slate-400 font-sans tracking-wide">
            {draftOrder.coram}
          </p>
          <div className="pt-2 text-sm font-bold text-white font-sans uppercase tracking-wider">
            {draftOrder.title}
          </div>
        </div>

        {/* Edit / View Mode Control */}
        <div className="flex justify-between items-center font-sans text-xs text-slate-400 relative z-10">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Next Hearing Date:</span>
            {isEditing ? (
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-amber-400"
              />
            ) : (
              <span className="font-bold text-amber-400 font-mono">{nextDate}</span>
            )}
          </div>

          {!isApproved && (
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1 transition-colors"
            >
              {isEditing ? <Save className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isEditing ? 'Save Edits' : 'Edit Order Text'}</span>
            </button>
          )}
        </div>

        {/* Order Body Text Area */}
        <div className="relative z-10">
          {isEditing ? (
            <textarea
              value={orderText}
              onChange={(e) => setOrderText(e.target.value)}
              rows={12}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm font-serif text-slate-100 leading-relaxed focus:outline-none focus:border-amber-500 font-normal"
            />
          ) : (
            <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-200 font-serif p-4 bg-slate-950/40 rounded-xl border border-slate-800/80">
              {orderText}
            </div>
          )}
        </div>

        {/* Specific Directives List */}
        {draftOrder.directions?.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-sans relative z-10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Specific Judicial Directions Issued
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {draftOrder.directions.map((d, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Judicial Notes for Bench */}
        {canApprove && (
          <div className="pt-4 border-t border-slate-800 font-sans relative z-10">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Hon'ble Judge's Confidential Bench Notes
            </label>
            <textarea
              value={judgeNotes}
              onChange={(e) => setJudgeNotes(e.target.value)}
              placeholder="Add confidential judicial bench notes, registry instructions, or dictation remarks..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 placeholder-slate-600"
            />
          </div>
        )}

        {/* Official Signature Seal Block */}
        <div className="pt-8 flex justify-between items-end border-t border-slate-800 font-sans relative z-10">
          <div className="text-xs text-slate-500">
            <div>Order Generated via Saakshya Engine</div>
            <div>High Court Registry Verification ID: {draftOrder.id}</div>
          </div>

          <div className="text-right">
            {isApproved ? (
              <div className="space-y-1">
                <div className="w-32 h-12 ml-auto border-b-2 border-emerald-500/80 flex items-end justify-center pb-1 text-emerald-400 font-serif italic text-sm">
                  R. S. Sharma
                </div>
                <div className="text-xs font-bold text-white font-serif">
                  (HON'BLE MR. JUSTICE R. S. SHARMA)
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  Digitally Signed & Approved ({approvedAt})
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">
                Pending Judicial Signature
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
