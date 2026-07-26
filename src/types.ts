export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type UserRole = 'JUDGE' | 'LAWYER' | 'CLERK';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  court: string;
  avatar: string;
}

export interface Paragraph {
  id: number; // 1-indexed paragraph number
  text: string;
}

export interface GroundedSentence {
  id: string;
  sentence: string;
  sourceParagraphId: number;
  confidence: number; // e.g. 96 for 96%
  category: 'FACTS' | 'ARGUMENTS' | 'RATIO' | 'PROCEDURAL' | 'RULING' | 'KEY_CLAIM';
  excerpt: string; // Brief quote from source paragraph
}

export interface GroundedSummary {
  sentences: GroundedSentence[];
  keyTakeaways: string[];
  proceduralHistory: string;
}

export interface CitationNode {
  id: string;
  title: string;
  type: 'STATUTE' | 'PRECEDENT' | 'ARTICLE' | 'SECTION';
  category?: string; // e.g., 'IPC', 'CrPC', 'BNS', 'Constitution'
  relevance: string; // Why this citation matters
  status?: 'GOOD_LAW' | 'DISTINGUISHED' | 'OVERRULED' | 'APPLICABLE';
  summary?: string;
  x?: number;
  y?: number;
}

export interface CitationEdge {
  source: string; // Citation ID or 'CURRENT_CASE'
  target: string;
  label?: string;
}

export interface PrecedentGraph {
  nodes: CitationNode[];
  edges: CitationEdge[];
}

export interface UrgencyInfo {
  level: UrgencyLevel;
  score: number; // 0 - 100
  reasons: string[];
  keyFactors: {
    isBailApplication: boolean;
    hasMedicalEmergency: boolean;
    isSeniorCitizen: boolean;
    isLimitationExpiring: boolean;
    constitutionalRightsAtStake: boolean;
  };
}

export interface DraftOrder {
  id: string;
  caseId: string;
  title: string;
  courtName: string;
  coram: string;
  orderText: string;
  nextHearingDate: string;
  directions: string[];
  status: 'DRAFT' | 'APPROVED' | 'DISPOSED';
  approvedBy?: string;
  approvedAt?: string;
  judgeNotes?: string;
}

export interface TranslatedSummary {
  language: LanguageCode;
  languageName: string;
  sentences: GroundedSentence[];
}

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr';

export interface CaseTimelineEvent {
  id: string;
  date: string; // e.g. "2025-11-14" or "14 Nov 2025"
  title: string;
  description: string;
  type: 'FILING' | 'ORDER' | 'HEARING' | 'EVIDENCE' | 'INCIDENT' | 'ARREST' | 'NOTICES';
  sourceParagraphId?: number;
  courtLocation?: string;
  status?: 'COMPLETED' | 'UPCOMING' | 'PENDING';
}

export interface CaseFile {
  id: string;
  caseNumber: string;
  title: string;
  petitioner: string;
  respondent: string;
  court: string;
  filingDate: string;
  nextHearingDate?: string;
  judgeBench?: string;
  caseType: 'CRIMINAL_APPEAL' | 'BAIL_APPLICATION' | 'WRIT_PETITION' | 'CIVIL_SUIT' | 'ARBITRATION_APPEAL';
  status: 'PENDING' | 'UNDER_HEARING' | 'ORDER_RESERVED' | 'DISPOSED';
  
  // Document contents
  rawText: string;
  paragraphs: Paragraph[];
  
  // AI Derived Analysis
  summary: GroundedSummary;
  urgency: UrgencyInfo;
  citationGraph: PrecedentGraph;
  draftOrder: DraftOrder;
  timelineEvents?: CaseTimelineEvent[];
  consistencyAnalysis?: JudicialConsistencyAnalysis;
  plainLanguageSummary?: GroundedSentence[];

  // Cached translations
  translations?: Record<LanguageCode, GroundedSentence[]>;
  
  fileType?: 'PDF' | 'DOCX' | 'TEXT';
  uploadedAt: string;
  uploadedBy: string;
}

export interface CaseBookmark {
  caseId: string;
  bookmarkedAt: string;
  notes?: string;
  folder?: string;
  tags?: string[];
}

export interface CourtAnalytics {
  totalPendingCases: number;
  avgSummaryTimeMinutes: number;
  urgencyBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  urgencyMonthlyTrend?: {
    month: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }[];
  backlogMonthlyTrend: {
    month: string;
    filed: number;
    disposed: number;
    backlog: number;
  }[];
  topCitedSections: {
    section: string;
    act: string;
    count: number;
  }[];
  courtPendency: {
    court: string;
    count: number;
    avgDaysPending: number;
  }[];
}

export interface PrecedentComparison {
  caseId: string;
  caseTitle: string;
  caseNumber: string;
  court: string;
  offenseSections: string[];
  custodyPeriod?: string;
  outcome: string;
  similarityScore: number; // 0 - 100
  keyDivergenceOrParity: string;
}

export interface GroundedFactorComparison {
  factor: string;
  status: 'PARITY' | 'DISPARITY' | 'DISTINGUISHABLE';
  details: string;
  sourceParagraphId?: number;
  comparedCaseRef?: string;
}

export interface JudicialConsistencyAnalysis {
  consistencyScore: number; // 0 - 100
  alignmentStatus: 'ALIGNED' | 'MINOR_VARIANCE' | 'OUTLIER';
  explanation: string;
  isOutlier: boolean;
  outlierLabel?: string; // "⚠ Review for Consistency"
  outlierReason?: string;
  similarPrecedents: PrecedentComparison[];
  groundedFactors: GroundedFactorComparison[];
}

