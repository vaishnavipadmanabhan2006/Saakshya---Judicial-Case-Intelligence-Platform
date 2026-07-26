import React, { useState } from 'react';
import { CaseFile } from '../types';
import { Upload, FileText, CheckCircle2, RefreshCw, X, AlertCircle, Sparkles, Shield, FileCheck } from 'lucide-react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: CaseFile) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [caseTitle, setCaseTitle] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [court, setCourt] = useState('High Court of Delhi');
  const [mode, setMode] = useState<'FILE' | 'PASTE'>('FILE');

  // Loading & Processing Steps State
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const steps = [
    'Parsing PDF/DOCX Document Text & Numbered Paragraphs...',
    'Generating Grounded AI Summary with Sentence-to-Paragraph Mapping...',
    'Evaluating Case Urgency & Liberty Triage Factors...',
    'Extracting Statutory Law Sections (IPC/BNS/CrPC) & Precedents...',
    'Structuring Draft Judicial Order Template for Review...'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!caseTitle) {
        setCaseTitle(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsProcessing(true);
    setCurrentStep(0);

    try {
      let textToAnalyze = rawText;

      // Step 1: If file uploaded, extract text from backend
      if (mode === 'FILE' && file) {
        setCurrentStep(0);
        const formData = new FormData();
        formData.append('file', file);

        const extractRes = await fetch('/api/extract-text', {
          method: 'POST',
          body: formData
        });

        const extractTextStr = await extractRes.text();
        let extractData: any;
        try {
          extractData = JSON.parse(extractTextStr);
        } catch {
          throw new Error(`Server error (${extractRes.status}): Could not parse response. ${extractTextStr.slice(0, 100)}`);
        }

        if (!extractRes.ok) {
          throw new Error(extractData.error || 'Failed to extract text from document.');
        }

        textToAnalyze = extractData.text;
      }

      if (!textToAnalyze || textToAnalyze.trim().length < 20) {
        throw new Error('Document text is too short. Please upload or paste a legal petition text.');
      }

      // Progress animation across Gemini AI analysis steps
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1500);

      // Step 2: Call Gemini AI Case Analysis Endpoint
      const analyzeRes = await fetch('/api/analyze-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: textToAnalyze,
          title: caseTitle || 'Uploaded Legal Petition',
          caseNumber: caseNumber || `Bail Appln. ${Math.floor(1000 + Math.random() * 9000)}/2026`,
          court: court || 'High Court of Delhi'
        })
      });

      clearInterval(interval);

      const analyzeTextStr = await analyzeRes.text();
      let data: any;
      try {
        data = JSON.parse(analyzeTextStr);
      } catch {
        throw new Error(`AI Analysis server error (${analyzeRes.status}): ${analyzeTextStr.slice(0, 100)}`);
      }

      if (!analyzeRes.ok) {
        throw new Error(data.error || 'Gemini AI Analysis failed.');
      }

      // Format complete CaseFile object
      const newCase: CaseFile = {
        id: `case_${Date.now()}`,
        caseNumber: data.caseNumber || caseNumber || `Case/${Math.floor(1000 + Math.random() * 9000)}/2026`,
        title: data.caseTitle || caseTitle || 'Uploaded Legal Petition',
        petitioner: data.petitioner || 'Petitioner',
        respondent: data.respondent || 'Respondent / State',
        court: data.court || court,
        filingDate: new Date().toISOString().split('T')[0],
        caseType: data.caseType || 'BAIL_APPLICATION',
        status: 'UNDER_HEARING',
        rawText: textToAnalyze,
        paragraphs: data.paragraphs || [],
        summary: data.summary,
        urgency: data.urgency,
        citationGraph: data.citationGraph,
        draftOrder: {
          id: `ord_${Date.now()}`,
          caseId: `case_${Date.now()}`,
          title: data.draftOrder?.title || 'DRAFT JUDICIAL ORDER',
          courtName: data.draftOrder?.courtName || court,
          coram: data.draftOrder?.coram || 'CORAM: HON\'BLE BENCH',
          orderText: data.draftOrder?.orderText || 'Order text pending review.',
          nextHearingDate: data.draftOrder?.nextHearingDate || '2026-08-15',
          directions: data.draftOrder?.directions || [],
          status: 'DRAFT'
        },
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Current User',
        fileType: file?.name.endsWith('.docx') ? 'DOCX' : 'PDF'
      };

      setIsProcessing(false);
      onCaseCreated(newCase);
      onClose();
    } catch (err: any) {
      console.error('Upload Error:', err);
      setIsProcessing(false);
      setErrorMsg(err.message || 'An error occurred during case analysis.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full text-slate-100 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-white">Upload New Case Document</h2>
              <p className="text-xs text-slate-400">Run Grounded AI Sentence Tracing, Triage & Citation Mapping</p>
            </div>
          </div>

          {!isProcessing && (
            <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        {isProcessing ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold font-serif text-white">
                Saakshya Intelligence Engine Active
              </h3>
              <p className="text-xs text-amber-400 font-mono">
                {steps[currentStep]}
              </p>
            </div>

            {/* Step Progress Checklist */}
            <div className="max-w-md mx-auto space-y-2 text-left text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              {steps.map((s, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  {idx < currentStep ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : idx === currentStep ? (
                    <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className={idx <= currentStep ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-slate-300">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Mode Switcher */}
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setMode('FILE')}
                className={`flex-1 py-1.5 rounded text-xs font-semibold transition-all ${
                  mode === 'FILE' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Upload PDF / DOCX File
              </button>
              <button
                type="button"
                onClick={() => setMode('PASTE')}
                className={`flex-1 py-1.5 rounded text-xs font-semibold transition-all ${
                  mode === 'PASTE' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Paste Petition / Order Text
              </button>
            </div>

            {/* Title & Case Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase text-slate-400 mb-1">Case Title</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Chandra v. Union of India"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-400 mb-1">Case Number</label>
                <input
                  type="text"
                  placeholder="e.g. Bail Appln. 2011/2026"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Court Selection */}
            <div>
              <label className="block font-semibold uppercase text-slate-400 mb-1">Court Forum</label>
              <select
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="High Court of Delhi">High Court of Delhi</option>
                <option value="Supreme Court of India">Supreme Court of India</option>
                <option value="High Court of Judicature at Bombay">High Court of Judicature at Bombay</option>
                <option value="High Court of Judicature at Allahabad">High Court of Judicature at Allahabad</option>
                <option value="District & Sessions Court">District & Sessions Court</option>
              </select>
            </div>

            {/* Upload Area or Text Input */}
            {mode === 'FILE' ? (
              <div>
                <label className="block font-semibold uppercase text-slate-400 mb-1">Document File (.pdf or .docx)</label>
                <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-6 text-center bg-slate-950/50 cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload-input"
                  />
                  <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block">
                    <FileText className="w-8 h-8 text-amber-400 mx-auto" />
                    <div className="font-semibold text-slate-200">
                      {file ? file.name : 'Click to select or drag PDF/DOCX file here'}
                    </div>
                    <p className="text-[11px] text-slate-500">Supports PDF & Word DOCX up to 20MB</p>
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold uppercase text-slate-400">Paste Raw Petition / Judgment Text</label>
                  <button
                    type="button"
                    onClick={() => {
                      setCaseTitle('Vikram Sethi v. State of NCT of Delhi');
                      setCaseNumber('Bail Appln. 3412/2026');
                      setRawText(`1. This is an urgent Application for Grant of Regular Bail under Section 439 of the Code of Criminal Procedure, 1973 (read with Section 483 of the Bharatiya Nagarik Suraksha Sanhita, 2023) on behalf of the Applicant, Vikram Sethi, currently lodged in Central Jail No. 4, Tihar, New Delhi.\n\n2. The Applicant was arrested on 14th January 2026 in connection with FIR No. 102/2026 registered at Police Station Connaught Place under Sections 420 and 120-B of the Indian Penal Code (IPC).\n\n3. The Applicant is a 68-year-old senior citizen suffering from severe diabetic neuropathy and coronary artery disease. He requires continuous specialized medical care and monitoring which cannot be provided adequately within the jail infirmary.\n\n4. It is submitted that the investigation in the present FIR is substantially complete, all physical documents have been seized by the Police, and no custodial interrogation of the Applicant is required.\n\n5. The Applicant relies on the landmark judgment of the Hon'ble Supreme Court in Sanjay Chandra v. CBI (2012) 1 SCC 40, wherein it was authoritatively laid down that bail is the rule and committal to jail an exception, and Article 21 guarantees fundamental personal liberty.`);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-medium underline flex items-center space-x-1 text-[11px]"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Load Sample Bail Petition Text</span>
                  </button>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={8}
                  placeholder="Paste complete legal document text with paragraphs here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 flex justify-end space-x-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Process with Gemini AI</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
