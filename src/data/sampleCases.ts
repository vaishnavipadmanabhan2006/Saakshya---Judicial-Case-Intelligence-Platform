import { CaseFile, CourtAnalytics, UserProfile } from '../types';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr_judge_1',
    name: 'Hon\'ble Justice R. S. Sharma',
    role: 'JUDGE',
    title: 'Senior Sitting Judge',
    court: 'High Court of Delhi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'usr_lawyer_1',
    name: 'Advocate Ananya Roy',
    role: 'LAWYER',
    title: 'Senior Counsel',
    court: 'Supreme Court & High Court of Delhi',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'usr_clerk_1',
    name: 'S. K. Verma',
    role: 'CLERK',
    title: 'Deputy Registrar (Listing & Urgency)',
    court: 'High Court of Delhi Registry',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  }
];

export const SAMPLE_CASES: CaseFile[] = [
  {
    id: 'case_dl_2026_439',
    caseNumber: 'Bail Appln. No. 1428/2026',
    title: 'Rajesh Kumar v. State (NCT of Delhi)',
    petitioner: 'Rajesh Kumar',
    respondent: 'State (NCT of Delhi)',
    court: 'High Court of Delhi',
    filingDate: '2026-07-12',
    nextHearingDate: '2026-07-28',
    judgeBench: 'Bench of Hon\'ble Mr. Justice R. S. Sharma',
    caseType: 'BAIL_APPLICATION',
    status: 'UNDER_HEARING',
    uploadedAt: '2026-07-14T10:30:00Z',
    uploadedBy: 'Advocate Ananya Roy',
    fileType: 'PDF',

    rawText: `IN THE HIGH COURT OF DELHI AT NEW DELHI
BAIL APPLICATION NO. 1428 OF 2026

IN THE MATTER OF:
Rajesh Kumar ... Petitioner
Versus
State (NCT of Delhi) ... Respondent

PETITION FOR REGULAR BAIL UNDER SECTION 439 OF THE CODE OF CRIMINAL PROCEDURE, 1973 (READ WITH SECTION 483 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023)

Paragraph 1:
The present bail application has been filed on behalf of the applicant/petitioner Shri Rajesh Kumar under Section 439 Cr.P.C. seeking regular bail in connection with FIR No. 382/2025 registered at Police Station Connaught Place, New Delhi under Sections 420/406/120B IPC (Section 318/316 BNS). The applicant was arrested on 14th November 2025 and has been continuously in judicial custody for over eight months.

Paragraph 2:
The prosecution case in brief is that the applicant, along with co-accused persons, induced the complainant company to invest ₹1.85 Crores under a false promise of allocating commercial land plots in Greater Noida. It is alleged that no land was allotted and the invested funds were diverted into shell bank accounts managed by the applicant.

Paragraph 3:
Learned Senior Counsel for the petitioner submits that the petitioner has been falsely implicated due to commercial rivalry. Investigation in the matter is complete and the Investigating Officer (I.O.) has already filed the final police report/charge-sheet before the learned Metropolitan Magistrate on 10th February 2026. Therefore, custody of the applicant is no longer required for interrogation or recovery.

Paragraph 4:
It is further submitted that the applicant is a 67-year-old senior citizen suffering from severe diabetic nephropathy and advanced coronary artery disease, requiring continuous specialized medical intervention and dialysis twice weekly. Medical records issued by Dr. Ram Manohar Lohia Hospital, New Delhi dated 2nd July 2026 are annexed hereto as Annexure P-4 confirming deterioration of renal clearance.

Paragraph 5:
The petitioner emphasizes that co-accused Vivek Sharma, who had an identical role in signing bank transactions, was granted regular bail by the coordinate Bench of this Hon'ble Court vide order dated 15th April 2026 in Bail Appln. No. 890/2026 on grounds of parity and completion of investigation.

Paragraph 6:
Learned Additional Public Prosecutor (APP) appearing for the State opposes the bail application, contending that the applicant is the main beneficiary of the defrauded sum of ₹1.85 Crores and there is a grave apprehension of the applicant fleeing from justice or tampering with prosecution witnesses if enlarged on bail.

Paragraph 7:
In rebuttal, petitioner's counsel submits that the applicant is a permanent resident of Delhi with deep family roots, possesses a valid passport which he is willing to surrender before the Trial Court, and is ready to furnish sound surety to the satisfaction of the Court.

Paragraph 8:
Relying on the landmark rulings of the Hon'ble Supreme Court in Satender Kumar Antil v. CBI (2022) 10 SCC 51 and Sanjay Chandra v. CBI (2012) 1 SCC 40, counsel contends that pre-trial detention cannot be converted into punitive measures, especially when trial is delayed and the offence carries a maximum punishment of 7 years imprisonment.`,

    paragraphs: [
      { id: 1, text: 'The present bail application has been filed on behalf of the applicant/petitioner Shri Rajesh Kumar under Section 439 Cr.P.C. seeking regular bail in connection with FIR No. 382/2025 registered at Police Station Connaught Place, New Delhi under Sections 420/406/120B IPC (Section 318/316 BNS). The applicant was arrested on 14th November 2025 and has been continuously in judicial custody for over eight months.' },
      { id: 2, text: 'The prosecution case in brief is that the applicant, along with co-accused persons, induced the complainant company to invest ₹1.85 Crores under a false promise of allocating commercial land plots in Greater Noida. It is alleged that no land was allotted and the invested funds were diverted into shell bank accounts managed by the applicant.' },
      { id: 3, text: 'Learned Senior Counsel for the petitioner submits that the petitioner has been falsely implicated due to commercial rivalry. Investigation in the matter is complete and the Investigating Officer (I.O.) has already filed the final police report/charge-sheet before the learned Metropolitan Magistrate on 10th February 2026. Therefore, custody of the applicant is no longer required for interrogation or recovery.' },
      { id: 4, text: 'It is further submitted that the applicant is a 67-year-old senior citizen suffering from severe diabetic nephropathy and advanced coronary artery disease, requiring continuous specialized medical intervention and dialysis twice weekly. Medical records issued by Dr. Ram Manohar Lohia Hospital, New Delhi dated 2nd July 2026 are annexed hereto as Annexure P-4 confirming deterioration of renal clearance.' },
      { id: 5, text: 'The petitioner emphasizes that co-accused Vivek Sharma, who had an identical role in signing bank transactions, was granted regular bail by the coordinate Bench of this Hon\'ble Court vide order dated 15th April 2026 in Bail Appln. No. 890/2026 on grounds of parity and completion of investigation.' },
      { id: 6, text: 'Learned Additional Public Prosecutor (APP) appearing for the State opposes the bail application, contending that the applicant is the main beneficiary of the defrauded sum of ₹1.85 Crores and there is a grave apprehension of the applicant fleeing from justice or tampering with prosecution witnesses if enlarged on bail.' },
      { id: 7, text: 'In rebuttal, petitioner\'s counsel submits that the applicant is a permanent resident of Delhi with deep family roots, possesses a valid passport which he is willing to surrender before the Trial Court, and is ready to furnish sound surety to the satisfaction of the Court.' },
      { id: 8, text: 'Relying on the landmark rulings of the Hon\'ble Supreme Court in Satender Kumar Antil v. CBI (2022) 10 SCC 51 and Sanjay Chandra v. CBI (2012) 1 SCC 40, counsel contends that pre-trial detention cannot be converted into punitive measures, especially when trial is delayed and the offence carries a maximum punishment of 7 years imprisonment.' }
    ],

    summary: {
      sentences: [
        {
          id: 's1',
          sentence: 'Petitioner Rajesh Kumar seeks regular bail under Section 439 CrPC / Section 483 BNS after spending over 8 months in judicial custody since his arrest on Nov 14, 2025.',
          sourceParagraphId: 1,
          confidence: 99,
          category: 'PROCEDURAL',
          excerpt: 'applicant was arrested on 14th November 2025 and has been continuously in judicial custody for over eight months'
        },
        {
          id: 's2',
          sentence: 'The prosecution alleges financial fraud of ₹1.85 Crores involving commercial land plot allotments in Greater Noida and diversion into shell bank accounts.',
          sourceParagraphId: 2,
          confidence: 97,
          category: 'FACTS',
          excerpt: 'induced the complainant company to invest ₹1.85 Crores under a false promise... diverted into shell bank accounts'
        },
        {
          id: 's3',
          sentence: 'The investigation is complete and the charge-sheet was submitted on Feb 10, 2026, eliminating the necessity for custodial interrogation.',
          sourceParagraphId: 3,
          confidence: 98,
          category: 'KEY_CLAIM',
          excerpt: 'Investigation in the matter is complete and the I.O. has already filed the final police report/charge-sheet'
        },
        {
          id: 's4',
          sentence: 'Petitioner is a 67-year-old senior citizen suffering from severe diabetic nephropathy requiring bi-weekly dialysis at RML Hospital.',
          sourceParagraphId: 4,
          confidence: 99,
          category: 'FACTS',
          excerpt: '67-year-old senior citizen suffering from severe diabetic nephropathy... requiring continuous specialized medical intervention and dialysis twice weekly'
        },
        {
          id: 's5',
          sentence: 'Parity is claimed with co-accused Vivek Sharma, who was granted regular bail by a coordinate Bench on April 15, 2026.',
          sourceParagraphId: 5,
          confidence: 96,
          category: 'RATIO',
          excerpt: 'co-accused Vivek Sharma... was granted regular bail by the coordinate Bench of this Hon\'ble Court... on grounds of parity'
        },
        {
          id: 's6',
          sentence: 'State opposes bail citing primary beneficiary status and flight risk, while petitioner offers passport surrender and local surety.',
          sourceParagraphId: 6,
          confidence: 95,
          category: 'ARGUMENTS',
          excerpt: 'State opposes the bail application... In rebuttal... applicant is ready to surrender passport and furnish sound surety'
        },
        {
          id: 's7',
          sentence: 'Counsel invokes Supreme Court precedent (Satender Kumar Antil v. CBI & Sanjay Chandra v. CBI) emphasizing that pre-trial detention must not become punitive.',
          sourceParagraphId: 8,
          confidence: 98,
          category: 'RATIO',
          excerpt: 'Relying on landmark rulings in Satender Kumar Antil v. CBI... pre-trial detention cannot be converted into punitive measures'
        }
      ],
      keyTakeaways: [
        '8+ months judicial custody served for offenses carrying max 7-year imprisonment',
        'Charge-sheet already filed; no requirement for further custodial interrogation',
        'Acute medical urgency: 67yo senior citizen with stage-IV diabetic nephropathy needing bi-weekly dialysis',
        'Parity with co-accused already released on bail by Coordinate Bench'
      ],
      proceduralHistory: 'FIR No. 382/2025 PS Connaught Place. Charge-sheet filed Feb 10, 2026. Bail rejected by Metropolitan Magistrate and Sessions Court in March 2026. Moved High Court.'
    },

    timelineEvents: [
      {
        id: 'evt_1',
        date: '12 Aug 2025',
        title: 'FIR No. 382/2025 Registered',
        description: 'FIR registered at PS Connaught Place under Sections 420/406/120B IPC alleging non-allocation of Noida commercial plots.',
        type: 'INCIDENT',
        sourceParagraphId: 1,
        courtLocation: 'PS Connaught Place, New Delhi',
        status: 'COMPLETED'
      },
      {
        id: 'evt_2',
        date: '14 Nov 2025',
        title: 'Arrest of Petitioner & Remand',
        description: 'Shri Rajesh Kumar arrested by Investigating Officer and remanded to Tihar Judicial Custody.',
        type: 'ARREST',
        sourceParagraphId: 1,
        courtLocation: 'Tihar Jail / Metropolitan Magistrate Court',
        status: 'COMPLETED'
      },
      {
        id: 'evt_3',
        date: '10 Feb 2026',
        title: 'Investigation Completed & Charge-sheet Filed',
        description: 'IO submits final police report/charge-sheet before Ld. Metropolitan Magistrate, Patiala House Courts.',
        type: 'FILING',
        sourceParagraphId: 3,
        courtLocation: 'Patiala House Courts, New Delhi',
        status: 'COMPLETED'
      },
      {
        id: 'evt_4',
        date: '15 Apr 2026',
        title: 'Co-Accused Granted Parity Bail',
        description: 'Coordinate Bench grants regular bail to co-accused Vivek Sharma in Bail Appln No. 890/2026.',
        type: 'ORDER',
        sourceParagraphId: 5,
        courtLocation: 'High Court of Delhi',
        status: 'COMPLETED'
      },
      {
        id: 'evt_5',
        date: '02 Jul 2026',
        title: 'RML Hospital Medical Evaluation Issued',
        description: 'Medical certificate issued confirming severe diabetic nephropathy and twice-weekly dialysis schedule (Annexure P-4).',
        type: 'EVIDENCE',
        sourceParagraphId: 4,
        courtLocation: 'Dr. RML Hospital, New Delhi',
        status: 'COMPLETED'
      },
      {
        id: 'evt_6',
        date: '12 Jul 2026',
        title: 'Bail Application No. 1428/2026 Filed',
        description: 'Petitioner files regular bail application before Delhi High Court under Section 439 CrPC.',
        type: 'FILING',
        sourceParagraphId: 1,
        courtLocation: 'High Court of Delhi Registry',
        status: 'COMPLETED'
      },
      {
        id: 'evt_7',
        date: '28 Jul 2026',
        title: 'Scheduled High Court Hearing',
        description: 'Listed before Hon\'ble Mr. Justice R. S. Sharma for prosecution status report and bail determination.',
        type: 'HEARING',
        courtLocation: 'Courtroom No. 14, High Court of Delhi',
        status: 'UPCOMING'
      }
    ],

    urgency: {
      level: 'CRITICAL',
      score: 94,
      reasons: [
        'Bail Application involving prolonged personal liberty detention (Article 21)',
        'Acute medical emergency: 67yo senior citizen needing bi-weekly kidney dialysis (RML Hosp records annexed)',
        'Parity grounds established with co-accused already granted bail',
        'Charge-sheet filed; custodial interrogation concluded'
      ],
      keyFactors: {
        isBailApplication: true,
        hasMedicalEmergency: true,
        isSeniorCitizen: true,
        isLimitationExpiring: false,
        constitutionalRightsAtStake: true
      }
    },

    citationGraph: {
      nodes: [
        {
          id: 'CURRENT_CASE',
          title: 'Bail Appln. 1428/2026 (Rajesh Kumar v. State)',
          type: 'PRECEDENT',
          category: 'Current Case',
          relevance: 'Subject Case under Section 439 CrPC / Sec 483 BNS',
          status: 'APPLICABLE'
        },
        {
          id: 'CRPC_439',
          title: 'Section 439 Cr.P.C. / Sec 483 BNS',
          type: 'SECTION',
          category: 'Statute (CrPC/BNSS)',
          relevance: 'Special powers of High Court or Sessions Court regarding bail in non-bailable offences.',
          summary: 'Confers wide discretion upon High Court to grant bail considering nature of charge, severity of punishment, and medical condition.'
        },
        {
          id: 'IPC_420',
          title: 'Section 420/406 IPC (Sec 318/316 BNS)',
          type: 'SECTION',
          category: 'Statute (IPC/BNS)',
          relevance: 'Cheating & Criminal Breach of Trust',
          summary: 'Punishable up to 7 years imprisonment. Triable by Magistrate of First Class.'
        },
        {
          id: 'CASE_ANTIL',
          title: 'Satender Kumar Antil v. CBI (2022) 10 SCC 51',
          type: 'PRECEDENT',
          category: 'Supreme Court Landmark',
          relevance: 'Mandatory guidelines on bail; undertrial detention should not become punishment.',
          status: 'GOOD_LAW',
          summary: 'Supreme Court ruled that bail is the rule and jail is the exception. Standard guidelines prescribed for Category A offenses punishable under 7 years.'
        },
        {
          id: 'CASE_SANJAY_CHANDRA',
          title: 'Sanjay Chandra v. CBI (2012) 1 SCC 40',
          type: 'PRECEDENT',
          category: 'Supreme Court Landmark',
          relevance: 'Economic offenses bail principles and gravity vs duration of detention.',
          status: 'GOOD_LAW',
          summary: 'Gravity of charge alone cannot be sole ground to deny bail if charge-sheet is filed and trial is likely to take time.'
        },
        {
          id: 'CASE_PARITY',
          title: 'Vivek Sharma v. State (Bail Appln. 890/2026)',
          type: 'PRECEDENT',
          category: 'Coordinate Bench Ruling',
          relevance: 'Co-accused granted bail on identical charges.',
          status: 'APPLICABLE',
          summary: 'Coordinate Bench granted regular bail to co-accused after charge-sheet submission.'
        }
      ],
      edges: [
        { source: 'CURRENT_CASE', target: 'CRPC_439', label: 'Filed Under' },
        { source: 'CURRENT_CASE', target: 'IPC_420', label: 'Charges' },
        { source: 'CURRENT_CASE', target: 'CASE_ANTIL', label: 'Relies Upon' },
        { source: 'CURRENT_CASE', target: 'CASE_SANJAY_CHANDRA', label: 'Relies Upon' },
        { source: 'CURRENT_CASE', target: 'CASE_PARITY', label: 'Claims Parity' }
      ]
    },

    draftOrder: {
      id: 'ord_1428_2026',
      caseId: 'case_dl_2026_439',
      title: 'DRAFT ORDER — REGULAR BAIL WITH CONDITIONS',
      courtName: 'IN THE HIGH COURT OF DELHI AT NEW DELHI',
      coram: 'CORAM: HON\'BLE MR. JUSTICE R. S. SHARMA',
      orderText: `1. Present application under Section 439 Cr.P.C. (Section 483 BNSS) seeks regular bail in FIR No. 382/2025 under Sections 420/406/120B IPC registered at P.S. Connaught Place.

2. Heard learned Senior Counsel for the petitioner and learned APP for the State.

3. Considering that the petitioner is a 67-year-old senior citizen suffering from end-stage renal illness requiring bi-weekly dialysis, that the investigation is complete with charge-sheet filed on 10.02.2026, and co-accused has already been enlarged on bail by a coordinate bench, this Court is inclined to grant bail.

4. Accordingly, the petitioner is admitted to regular bail subject to the following conditions:
   a) Petitioner shall execute a personal bond in the sum of ₹1,00,000/- with two solvent sureties of like amount to the satisfaction of the learned Trial Court.
   b) Petitioner shall surrender his passport to the Trial Court within 7 days and shall not leave the National Capital Region without prior permission.
   c) Petitioner shall not tamper with evidence or influence prosecution witnesses.`,
      nextHearingDate: '2026-09-15',
      directions: [
        'Furnish Personal Bond of ₹1,00,000/- with two sureties to Trial Court',
        'Surrender Passport to Metropolitan Magistrate Court',
        'Appear before IO on first Monday of every month'
      ],
      status: 'DRAFT'
    },

    consistencyAnalysis: {
      consistencyScore: 92,
      alignmentStatus: 'ALIGNED',
      explanation: '3 similar bail applications with comparable custody duration (6-8 months) and offense sections (420/406 IPC / 318 BNS) were granted bail within 35 days once the charge-sheet was filed. This case has been pending for over 8 months without a hearing despite completed investigation and co-accused bail.',
      isOutlier: true,
      outlierLabel: '⚠ Review for Consistency',
      outlierReason: 'Unusually prolonged pre-trial detention (240+ days) compared to the 35-day benchmark average for non-violent financial fraud offenses where investigation is complete and co-accused has already been released.',
      similarPrecedents: [
        {
          caseId: 'prec_001',
          caseTitle: 'Vivek Sharma v. State (NCT of Delhi)',
          caseNumber: 'Bail Appln. No. 890/2026',
          court: 'High Court of Delhi',
          offenseSections: ['Section 420 IPC', 'Section 406 IPC', 'Section 120B IPC'],
          custodyPeriod: '45 Days',
          outcome: 'Regular Bail Granted',
          similarityScore: 96,
          keyDivergenceOrParity: 'Co-accused with identical bank signing role granted bail on April 15, 2026 on charge-sheet submission.'
        },
        {
          caseId: 'prec_002',
          caseTitle: 'Satender Kumar Antil v. CBI',
          caseNumber: '(2022) 10 SCC 51',
          court: 'Supreme Court of India',
          offenseSections: ['Section 439 CrPC', 'Category A Offenses (<7 Yrs)'],
          custodyPeriod: 'Under 60 Days',
          outcome: 'Bail Mandate Standard',
          similarityScore: 94,
          keyDivergenceOrParity: 'Landmark Supreme Court mandate prohibiting punitive pre-trial custody when charge-sheet is filed.'
        },
        {
          caseId: 'prec_003',
          caseTitle: 'Ramesh Chand v. State',
          caseNumber: 'Bail Appln. No. 312/2025',
          court: 'High Court of Delhi',
          offenseSections: ['Section 420 IPC', 'Section 468 IPC'],
          custodyPeriod: '30 Days',
          outcome: 'Medical Bail Granted',
          similarityScore: 91,
          keyDivergenceOrParity: '65-year-old senior citizen with stage-IV renal failure granted immediate regular bail on medical parity.'
        }
      ],
      groundedFactors: [
        {
          factor: 'Custody Duration',
          status: 'DISPARITY',
          details: 'Current custody of 240+ days significantly exceeds the 35-day benchmark average for non-violent property fraud after charge-sheet filing.',
          sourceParagraphId: 1,
          comparedCaseRef: 'Bail Appln. No. 890/2026 (45 Days)'
        },
        {
          factor: 'Medical Necessity',
          status: 'PARITY',
          details: '67yo senior citizen suffering from severe diabetic nephropathy requiring bi-weekly dialysis matches medical bail precedent.',
          sourceParagraphId: 4,
          comparedCaseRef: 'Bail Appln. No. 312/2025'
        },
        {
          factor: 'Co-Accused Parity',
          status: 'PARITY',
          details: 'Co-accused Vivek Sharma was granted regular bail by Coordinate Bench on 15 April 2026.',
          sourceParagraphId: 5,
          comparedCaseRef: 'Bail Appln. No. 890/2026'
        },
        {
          factor: 'Custodial Interrogation Need',
          status: 'PARITY',
          details: 'Charge-sheet filed on 10 Feb 2026; no further custody required for investigation or recovery.',
          sourceParagraphId: 3,
          comparedCaseRef: 'Satender Kumar Antil Guidelines'
        }
      ]
    },

    plainLanguageSummary: [
      {
        id: 'p1',
        sentence: 'Shri Rajesh Kumar is asking the High Court to grant him regular bail because he has already spent over 8 months in jail since his arrest in November 2025.',
        sourceParagraphId: 1,
        confidence: 99,
        category: 'PROCEDURAL',
        excerpt: 'applicant was arrested on 14th November 2025 and has been continuously in judicial custody for over eight months'
      },
      {
        id: 'p2',
        sentence: 'The police accused him of taking ₹1.85 Crores from a company under the promise of giving land plots that were never delivered.',
        sourceParagraphId: 2,
        confidence: 97,
        category: 'FACTS',
        excerpt: 'induced the complainant company to invest ₹1.85 Crores under a false promise... diverted into shell bank accounts'
      },
      {
        id: 'p3',
        sentence: 'His lawyer pointed out that the police have already finished their investigation and submitted their final charge-sheet in court, so keeping him in jail is no longer required for questioning.',
        sourceParagraphId: 3,
        confidence: 98,
        category: 'KEY_CLAIM',
        excerpt: 'Investigation in the matter is complete and the I.O. has already filed the final police report/charge-sheet'
      },
      {
        id: 'p4',
        sentence: 'Mr. Kumar is 67 years old and has severe kidney disease requiring him to go to RML Hospital for dialysis twice every week.',
        sourceParagraphId: 4,
        confidence: 99,
        category: 'FACTS',
        excerpt: '67-year-old senior citizen suffering from severe diabetic nephropathy... requiring continuous specialized medical intervention and dialysis twice weekly'
      },
      {
        id: 'p5',
        sentence: 'Another person accused in the same case, Vivek Sharma, was already released on bail by the High Court in April.',
        sourceParagraphId: 5,
        confidence: 96,
        category: 'RATIO',
        excerpt: 'co-accused Vivek Sharma... was granted regular bail by the coordinate Bench of this Hon\'ble Court... on grounds of parity'
      },
      {
        id: 'p6',
        sentence: 'The government lawyer opposed bail claiming he might flee, but Mr. Kumar offered to hand over his passport and remain in Delhi.',
        sourceParagraphId: 6,
        confidence: 95,
        category: 'ARGUMENTS',
        excerpt: 'State opposes the bail application... In rebuttal... applicant is ready to surrender passport and furnish sound surety'
      },
      {
        id: 'p7',
        sentence: 'His lawyer cited Supreme Court landmark decisions showing that keeping someone in jail before trial must not be used as punishment.',
        sourceParagraphId: 8,
        confidence: 98,
        category: 'RATIO',
        excerpt: 'Relying on landmark rulings in Satender Kumar Antil v. CBI... pre-trial detention cannot be converted into punitive measures'
      }
    ]
  },

  {
    id: 'case_sc_2026_881',
    caseNumber: 'SLP (Crl.) No. 5912/2026',
    title: 'Dr. Archana Deshmukh v. State of Maharashtra & Anr.',
    petitioner: 'Dr. Archana Deshmukh',
    respondent: 'State of Maharashtra & Anr.',
    court: 'Supreme Court of India',
    filingDate: '2026-06-20',
    nextHearingDate: '2026-08-02',
    judgeBench: 'Bench of Hon\'ble Chief Justice & Hon\'ble Mr. Justice K. V. Viswanathan',
    caseType: 'WRIT_PETITION',
    status: 'PENDING',
    uploadedAt: '2026-07-10T14:15:00Z',
    uploadedBy: 'Advocate Ananya Roy',
    fileType: 'PDF',

    rawText: `IN THE SUPREME COURT OF INDIA
EXTRAORDINARY APPELLATE JURISDICTION
SPECIAL LEAVE PETITION (CRIMINAL) NO. 5912 OF 2026

Dr. Archana Deshmukh ... Petitioner
Versus
State of Maharashtra & Anr. ... Respondents

PETITION UNDER ARTICLE 136 OF THE CONSTITUTION OF INDIA AGAINST IMPUGNED JUDGMENT DATED 02.05.2026 OF THE HIGH COURT OF JUDICATURE AT BOMBAY

Paragraph 1:
This Special Leave Petition is directed against the judgment of the Bombay High Court refusing to quash FIR No. 104/2026 registered under Section 304A IPC (Section 106 BNS - Causing death by negligence) against the petitioner, a senior chief cardiac surgeon at Ruby Hall Clinic, Pune.

Paragraph 2:
The factual matrix is that during an emergency aortic aneurysm repair surgery performed on 12th January 2026, the patient suffered an unpredictable cardiac arrest due to acute anaphylactic shock triggered by standard surgical contrast dye, resulting in patient fatality despite 90 minutes of CPR effort.

Paragraph 3:
Petitioner contends that the Medical Board constituted by the Sassoon General Hospital, Pune explicitly recorded in its report dated 18th March 2026 that there was no gross medical rashness or deviation from standard surgical protocols, and that anaphylaxis was a rare, unforeseeable adverse drug event.

Paragraph 4:
The High Court erred in holding that whether negligence was gross or ordinary is a matter of trial, ignoring the statutory safeguard mandated by the Supreme Court in Jacob Mathew v. State of Punjab (2005) 6 SCC 1.

Paragraph 5:
Paragraph 52 of Jacob Mathew explicitly lays down that a medical practitioner cannot be criminally prosecuted under Section 304A IPC unless the medical opinion obtained from a competent doctor establishes gross negligence or reckless disregard for patient safety.

Paragraph 6:
Allowing the criminal prosecution to proceed against an eminent surgeon without a prima facie finding of gross negligence creates a chilling effect on emergency surgical procedures across hospitals in Maharashtra.`,

    paragraphs: [
      { id: 1, text: 'This Special Leave Petition is directed against the judgment of the Bombay High Court refusing to quash FIR No. 104/2026 registered under Section 304A IPC (Section 106 BNS - Causing death by negligence) against the petitioner, a senior chief cardiac surgeon at Ruby Hall Clinic, Pune.' },
      { id: 2, text: 'The factual matrix is that during an emergency aortic aneurysm repair surgery performed on 12th January 2026, the patient suffered an unpredictable cardiac arrest due to acute anaphylactic shock triggered by standard surgical contrast dye, resulting in patient fatality despite 90 minutes of CPR effort.' },
      { id: 3, text: 'Petitioner contends that the Medical Board constituted by the Sassoon General Hospital, Pune explicitly recorded in its report dated 18th March 2026 that there was no gross medical rashness or deviation from standard surgical protocols, and that anaphylaxis was a rare, unforeseeable adverse drug event.' },
      { id: 4, text: 'The High Court erred in holding that whether negligence was gross or ordinary is a matter of trial, ignoring the statutory safeguard mandated by the Supreme Court in Jacob Mathew v. State of Punjab (2005) 6 SCC 1.' },
      { id: 5, text: 'Paragraph 52 of Jacob Mathew explicitly lays down that a medical practitioner cannot be criminally prosecuted under Section 304A IPC unless the medical opinion obtained from a competent doctor establishes gross negligence or reckless disregard for patient safety.' },
      { id: 6, text: 'Allowing the criminal prosecution to proceed against an eminent surgeon without a prima facie finding of gross negligence creates a chilling effect on emergency surgical procedures across hospitals in Maharashtra.' }
    ],

    summary: {
      sentences: [
        {
          id: 's1',
          sentence: 'Petitioner Dr. Archana Deshmukh challenges Bombay High Court order declining to quash Sec 304A IPC (Sec 106 BNS) FIR registered following patient surgical death.',
          sourceParagraphId: 1,
          confidence: 99,
          category: 'PROCEDURAL',
          excerpt: 'directed against the judgment of the Bombay High Court refusing to quash FIR... under Section 304A IPC'
        },
        {
          id: 's2',
          sentence: 'Patient fatality occurred due to an unexpected acute anaphylactic shock from surgical contrast dye during emergency aortic surgery despite 90 minutes CPR.',
          sourceParagraphId: 2,
          confidence: 97,
          category: 'FACTS',
          excerpt: 'unpredictable cardiac arrest due to acute anaphylactic shock triggered by standard surgical contrast dye'
        },
        {
          id: 's3',
          sentence: 'Sassoon General Hospital Medical Board report certified zero gross negligence or protocol breach, categorizing death as an unforeseeable adverse drug reaction.',
          sourceParagraphId: 3,
          confidence: 98,
          category: 'KEY_CLAIM',
          excerpt: 'Medical Board... explicitly recorded... no gross medical rashness or deviation from standard surgical protocols'
        },
        {
          id: 's4',
          sentence: 'High Court disregarded binding Supreme Court guidelines in Jacob Mathew v. State of Punjab mandating independent doctor opinion establishing gross negligence before criminal FIR.',
          sourceParagraphId: 4,
          confidence: 99,
          category: 'RATIO',
          excerpt: 'ignoring the statutory safeguard mandated by the Supreme Court in Jacob Mathew v. State of Punjab'
        },
        {
          id: 's5',
          sentence: 'Unwarranted criminal trial against emergency surgeons causes systemic chilling effect across medical care facilities.',
          sourceParagraphId: 6,
          confidence: 94,
          category: 'ARGUMENTS',
          excerpt: 'creates a chilling effect on emergency surgical procedures across hospitals in Maharashtra'
        }
      ],
      keyTakeaways: [
        'Direct application of binding precedent Jacob Mathew v. State of Punjab (2005) 6 SCC 1',
        'Official Medical Board report cleared doctor of gross negligence',
        'High Court order failed to apply constitutional protection against frivolous doctor prosecutions'
      ],
      proceduralHistory: 'FIR 104/2026 registered PS Koregaon Park Pune. Quashing petition under Sec 482 CrPC dismissed by Bombay HC on May 2, 2026. SLP filed in SC.'
    },

    urgency: {
      level: 'HIGH',
      score: 82,
      reasons: [
        'Challenging criminal prosecution against medical doctor in active practice',
        'Direct violation of binding SC guidelines (Jacob Mathew v. State of Punjab)',
        'Official Government Medical Board report exonerating petitioner already on record'
      ],
      keyFactors: {
        isBailApplication: false,
        hasMedicalEmergency: false,
        isSeniorCitizen: false,
        isLimitationExpiring: false,
        constitutionalRightsAtStake: true
      }
    },

    citationGraph: {
      nodes: [
        {
          id: 'CURRENT_CASE',
          title: 'SLP (Crl) 5912/2026 (Dr. Archana v. State of Maharashtra)',
          type: 'PRECEDENT',
          category: 'Current Case',
          relevance: 'Quashing of Medical Negligence FIR under Article 136',
          status: 'APPLICABLE'
        },
        {
          id: 'IPC_304A',
          title: 'Section 304A IPC / Section 106 BNS',
          type: 'SECTION',
          category: 'Statute (IPC/BNS)',
          relevance: 'Causing death by rash or negligent act not amounting to culpable homicide.',
          summary: 'Requires proof of gross negligence or reckless disregard when applied to qualified doctors.'
        },
        {
          id: 'CASE_JACOB_MATHEW',
          title: 'Jacob Mathew v. State of Punjab (2005) 6 SCC 1',
          type: 'PRECEDENT',
          category: 'Supreme Court 3-Judge Bench',
          relevance: 'Locus classicus on criminal medical negligence law in India.',
          status: 'GOOD_LAW',
          summary: 'Requires credible medical opinion showing gross negligence prior to registering criminal FIR against medical practitioner.'
        },
        {
          id: 'CASE_MARTIN_DOUZA',
          title: 'Martin F. D\'Souza v. Mohd. Ishfaq (2009) 3 SCC 1',
          type: 'PRECEDENT',
          category: 'Supreme Court Landmark',
          relevance: 'Protection of doctors against harassment in medical practice.',
          status: 'GOOD_LAW',
          summary: 'Police officers must not entertain complaints against doctors unless accompanied by expert medical board opinion.'
        }
      ],
      edges: [
        { source: 'CURRENT_CASE', target: 'IPC_304A', label: 'Seeks Quashing Of' },
        { source: 'CURRENT_CASE', target: 'CASE_JACOB_MATHEW', label: 'Binding Mandate' },
        { source: 'CURRENT_CASE', target: 'CASE_MARTIN_DOUZA', label: 'Corroborating Precedent' }
      ]
    },

    draftOrder: {
      id: 'ord_5912_2026',
      caseId: 'case_sc_2026_881',
      title: 'DRAFT ORDER — NOTICE & STAY OF CRIMINAL PROCEEDINGS',
      courtName: 'IN THE SUPREME COURT OF INDIA',
      coram: 'CORAM: HON\'BLE THE CHIEF JUSTICE & HON\'BLE MR. JUSTICE K. V. VISWANATHAN',
      orderText: `1. Permission to file Special Leave Petition granted.

2. Issue notice to Respondent Nos. 1 and 2, returnable in four weeks.

3. In the interim, having regard to the Medical Board Report dated 18.03.2026 exonerating the petitioner of gross negligence, further proceedings arising out of FIR No. 104/2026 PS Koregaon Park shall remain stayed till the next date of listing.`,
      nextHearingDate: '2026-09-08',
      directions: [
        'Issue Notice to State of Maharashtra and Complainant',
        'Stay further investigation and police proceedings in FIR 104/2026'
      ],
      status: 'DRAFT'
    },

    consistencyAnalysis: {
      consistencyScore: 95,
      alignmentStatus: 'ALIGNED',
      explanation: 'In 95% of similar medical negligence cases where an official government Medical Board exonerated the operating surgeon of gross rashness, the Supreme Court stayed criminal proceedings. The High Court\'s refusal to grant interim relief deviates from established Jacob Mathew precedents.',
      isOutlier: true,
      outlierLabel: '⚠ Review for Consistency',
      outlierReason: 'The High Court\'s refusal to grant interim stay departs from binding Supreme Court jurisprudence (Jacob Mathew v. State of Punjab), which mandates protecting medical practitioners from criminal trial when official medical board reports find no gross negligence.',
      similarPrecedents: [
        {
          caseId: 'prec_004',
          caseTitle: 'Jacob Mathew v. State of Punjab',
          caseNumber: '(2005) 6 SCC 1',
          court: 'Supreme Court of India',
          offenseSections: ['Section 304A IPC', 'Medical Rashness'],
          custodyPeriod: 'N/A (Pre-trial Quashing)',
          outcome: 'Strict Protection Mandate',
          similarityScore: 98,
          keyDivergenceOrParity: 'Binding 3-Judge Bench ruling requiring expert doctor board finding of gross negligence prior to criminal FIR.'
        },
        {
          caseId: 'prec_005',
          caseTitle: 'Martin F. D\'Souza v. Mohd. Ishfaq',
          caseNumber: '(2009) 3 SCC 1',
          court: 'Supreme Court of India',
          offenseSections: ['Section 304A IPC', 'Doctor Protection'],
          custodyPeriod: 'N/A',
          outcome: 'Police Complaint Quashed',
          similarityScore: 93,
          keyDivergenceOrParity: 'Police prohibited from prosecuting doctors unless independent expert board establishes gross disregard.'
        },
        {
          caseId: 'prec_006',
          caseTitle: 'Dr. Suresh Gupta v. Govt. of NCT of Delhi',
          caseNumber: '(2004) 6 SCC 422',
          court: 'Supreme Court of India',
          offenseSections: ['Section 304A IPC'],
          custodyPeriod: 'N/A',
          outcome: 'FIR Quashed',
          similarityScore: 91,
          keyDivergenceOrParity: 'Surgical complication during anesthesia does not constitute gross negligence without reckless breach.'
        }
      ],
      groundedFactors: [
        {
          factor: 'Medical Board Clearance',
          status: 'PARITY',
          details: 'Sassoon Hospital Board certified zero gross negligence; aligns directly with Jacob Mathew paragraph 52 requirements.',
          sourceParagraphId: 3,
          comparedCaseRef: 'Jacob Mathew (2005) 6 SCC 1'
        },
        {
          factor: 'High Court Deviation',
          status: 'DISPARITY',
          details: 'High Court sent matter to full trial despite statutory Supreme Court protection for practicing emergency surgeons.',
          sourceParagraphId: 4,
          comparedCaseRef: 'Martin F. D\'Souza (2009) 3 SCC 1'
        },
        {
          factor: 'Surgical Emergency Context',
          status: 'PARITY',
          details: 'Emergency aortic aneurysm repair with anaphylaxis is an unpredictable adverse drug reaction, not reckless surgery.',
          sourceParagraphId: 2,
          comparedCaseRef: 'Dr. Suresh Gupta (2004)'
        }
      ]
    },

    plainLanguageSummary: [
      {
        id: 'p1',
        sentence: 'Dr. Archana Deshmukh, a senior heart surgeon, is asking the Supreme Court to stop a criminal case filed against her after a patient died during emergency surgery.',
        sourceParagraphId: 1,
        confidence: 99,
        category: 'PROCEDURAL',
        excerpt: 'directed against the judgment of the Bombay High Court refusing to quash FIR... under Section 304A IPC'
      },
      {
        id: 'p2',
        sentence: 'The patient suffered an unexpected severe allergic reaction to medical dye during emergency heart surgery, and passed away despite 90 minutes of CPR efforts.',
        sourceParagraphId: 2,
        confidence: 97,
        category: 'FACTS',
        excerpt: 'unpredictable cardiac arrest due to acute anaphylactic shock triggered by standard surgical contrast dye'
      },
      {
        id: 'p3',
        sentence: 'An official government Medical Board examined the surgery and officially confirmed that Dr. Deshmukh followed all medical standards and was not careless.',
        sourceParagraphId: 3,
        confidence: 98,
        category: 'KEY_CLAIM',
        excerpt: 'Medical Board... explicitly recorded... no gross medical rashness or deviation from standard surgical protocols'
      },
      {
        id: 'p4',
        sentence: 'The High Court refused to dismiss the FIR, but Dr. Deshmukh points out that this breaks a major Supreme Court rule protecting doctors from criminal charges without proof of gross negligence.',
        sourceParagraphId: 4,
        confidence: 99,
        category: 'RATIO',
        excerpt: 'ignoring the statutory safeguard mandated by the Supreme Court in Jacob Mathew v. State of Punjab'
      },
      {
        id: 'p5',
        sentence: 'Allowing emergency doctors to face criminal trials for unavoidable surgical accidents will scare surgeons away from performing life-saving emergency operations.',
        sourceParagraphId: 6,
        confidence: 94,
        category: 'ARGUMENTS',
        excerpt: 'creates a chilling effect on emergency surgical procedures across hospitals in Maharashtra'
      }
    ]
  },

  {
    id: 'case_mumbai_2026_112',
    caseNumber: 'Commercial Arb. Appeal No. 44/2026',
    title: 'Adani Logistics Ltd. v. Jawaharlal Nehru Port Authority',
    petitioner: 'Adani Logistics Ltd.',
    respondent: 'Jawaharlal Nehru Port Authority',
    court: 'High Court of Judicature at Bombay',
    filingDate: '2026-05-18',
    nextHearingDate: '2026-08-10',
    judgeBench: 'Division Bench of Hon\'ble Mr. Justice G. S. Patel & Hon\'ble Ms. Justice Neela Gokhale',
    caseType: 'ARBITRATION_APPEAL',
    status: 'PENDING',
    uploadedAt: '2026-07-01T09:00:00Z',
    uploadedBy: 'S. K. Verma',
    fileType: 'DOCX',

    rawText: `IN THE HIGH COURT OF JUDICATURE AT BOMBAY
COMMERCIAL APPELLATE JURISDICTION
COMMERCIAL ARBITRATION APPEAL NO. 44 OF 2026

Adani Logistics Ltd. ... Appellant
Versus
Jawaharlal Nehru Port Authority ... Respondent

APPEAL UNDER SECTION 37 OF THE ARBITRATION AND CONCILIATION ACT, 1996

Paragraph 1:
This Commercial Arbitration Appeal under Section 37 of the Arbitration & Conciliation Act, 1996 impugns order dated 10th April 2026 passed by the learned Commercial Court, Navi Mumbai under Section 9 refusing interim protection against wrongful termination of the Container Terminal Concession Agreement dated 14th June 2021.

Paragraph 2:
The dispute pertains to the operation of Terminal-4 at JNPA Port. The Respondent Authority issued a termination notice dated 28th March 2026 citing alleged shortfall in Guaranteed Minimum Annual Cargo Throughput for the operational year 2024-2025.

Paragraph 3:
Appellant submits that cargo throughput shortfall was directly caused by Force Majeure events, specifically severe coastal cyclone monsoon disruptions and nav-channel dredging delays managed solely by the Port Authority, as documented in official port logs.

Paragraph 4:
The Commercial Court erred in refusing injunction against invocation of the Performance Bank Guarantee of ₹45 Crores, failing to appreciate that the termination was patently arbitrary and would render the upcoming arbitration proceedings under Section 11 infructuous.

Paragraph 5:
It is submitted that under settled law in Associate Builders v. DDA (2015) 3 SCC 49 and ONGC Ltd. v. Saw Pipes Ltd. (2003) 5 SCC 705, arbitrary state action violating contractual equity warrants interim injunction where irreparable injury to port infrastructure operations is demonstrated.`,

    paragraphs: [
      { id: 1, text: 'This Commercial Arbitration Appeal under Section 37 of the Arbitration & Conciliation Act, 1996 impugns order dated 10th April 2026 passed by the learned Commercial Court, Navi Mumbai under Section 9 refusing interim protection against wrongful termination of the Container Terminal Concession Agreement dated 14th June 2021.' },
      { id: 2, text: 'The dispute pertains to the operation of Terminal-4 at JNPA Port. The Respondent Authority issued a termination notice dated 28th March 2026 citing alleged shortfall in Guaranteed Minimum Annual Cargo Throughput for the operational year 2024-2025.' },
      { id: 3, text: 'Appellant submits that cargo shortfall was directly caused by Force Majeure events, specifically severe coastal cyclone monsoon disruptions and nav-channel dredging delays managed solely by the Port Authority, as documented in official port logs.' },
      { id: 4, text: 'The Commercial Court erred in refusing injunction against invocation of the Performance Bank Guarantee of ₹45 Crores, failing to appreciate that the termination was patently arbitrary and would render the upcoming arbitration proceedings under Section 11 infructuous.' },
      { id: 5, text: 'It is submitted that under settled law in Associate Builders v. DDA (2015) 3 SCC 49 and ONGC Ltd. v. Saw Pipes Ltd. (2003) 5 SCC 705, arbitrary state action violating contractual equity warrants interim injunction where irreparable injury to port infrastructure operations is demonstrated.' }
    ],

    summary: {
      sentences: [
        {
          id: 's1',
          sentence: 'Appeal under Section 37 Arbitration Act challenging Commercial Court order refusing interim stay against concession contract termination at JNPA Port.',
          sourceParagraphId: 1,
          confidence: 98,
          category: 'PROCEDURAL',
          excerpt: 'impugns order dated 10th April 2026... under Section 9 refusing interim protection'
        },
        {
          id: 's2',
          sentence: 'JNPA issued termination notice citing cargo throughput shortfalls for FY 2024-25.',
          sourceParagraphId: 2,
          confidence: 96,
          category: 'FACTS',
          excerpt: 'issued a termination notice dated 28th March 2026 citing alleged shortfall in Guaranteed Minimum Annual Cargo Throughput'
        },
        {
          id: 's3',
          sentence: 'Appellant claims cargo shortfall stemmed from Force Majeure monsoonal disruptions and dredging failures attributable to JNPA itself.',
          sourceParagraphId: 3,
          confidence: 97,
          category: 'KEY_CLAIM',
          excerpt: 'cargo shortfall was directly caused by Force Majeure events... and nav-channel dredging delays managed solely by Port Authority'
        },
        {
          id: 's4',
          sentence: 'Commercial Court wrongly permitted encashment of ₹45 Crore Bank Guarantee despite imminent risk of arbitral infructuousness.',
          sourceParagraphId: 4,
          confidence: 95,
          category: 'ARGUMENTS',
          excerpt: 'erred in refusing injunction against invocation of the Performance Bank Guarantee of ₹45 Crores'
        },
        {
          id: 's5',
          sentence: 'Relies on Associate Builders v. DDA and ONGC v. Saw Pipes regarding public policy standards and protection against arbitrary state cancellation.',
          sourceParagraphId: 5,
          confidence: 96,
          category: 'RATIO',
          excerpt: 'under settled law in Associate Builders v. DDA... arbitrary state action violating contractual equity warrants interim injunction'
        }
      ],
      keyTakeaways: [
        'Interim relief under Sec 37 against ₹45 Cr Bank Guarantee encashment',
        'Force Majeure & Port Authority default alleged',
        'Substantial commercial infrastructure stake'
      ],
      proceduralHistory: 'Sec 9 application dismissed by Navi Mumbai Commercial Court on April 10, 2026. Sec 37 Appeal filed in Bombay HC.'
    },

    urgency: {
      level: 'MEDIUM',
      score: 68,
      reasons: [
        'Imminent encashment of ₹45 Crore Performance Bank Guarantee',
        'Involves key maritime container terminal infrastructure',
        'No active criminal custody or physical liberty threat'
      ],
      keyFactors: {
        isBailApplication: false,
        hasMedicalEmergency: false,
        isSeniorCitizen: false,
        isLimitationExpiring: false,
        constitutionalRightsAtStake: false
      }
    },

    citationGraph: {
      nodes: [
        {
          id: 'CURRENT_CASE',
          title: 'Commercial Arb Appeal 44/2026 (Adani Logistics v. JNPA)',
          type: 'PRECEDENT',
          category: 'Current Case',
          relevance: 'Sec 37 Appeal against Sec 9 order refusal',
          status: 'APPLICABLE'
        },
        {
          id: 'ARB_SEC_37',
          title: 'Section 37 Arbitration Act 1996',
          type: 'SECTION',
          category: 'Statute (Arbitration)',
          relevance: 'Appeals against interim orders passed under Section 9.',
          summary: 'Appellate court examines whether lower court exercised discretion arbitrarily or perversely.'
        },
        {
          id: 'CASE_ASSOCIATE_BUILDERS',
          title: 'Associate Builders v. DDA (2015) 3 SCC 49',
          type: 'PRECEDENT',
          category: 'Supreme Court Landmark',
          relevance: 'Public policy of India & fundamental policy of Indian law.',
          status: 'GOOD_LAW',
          summary: 'Arbitrary and unreasonable administrative action by public authorities violates fundamental principles of justice.'
        }
      ],
      edges: [
        { source: 'CURRENT_CASE', target: 'ARB_SEC_37', label: 'Appellate Remedy' },
        { source: 'CURRENT_CASE', target: 'CASE_ASSOCIATE_BUILDERS', label: 'Public Policy Precedent' }
      ]
    },

    draftOrder: {
      id: 'ord_44_2026',
      caseId: 'case_mumbai_2026_112',
      title: 'DRAFT ORDER — STATUS QUO ON BANK GUARANTEE',
      courtName: 'IN THE HIGH COURT OF JUDICATURE AT BOMBAY',
      coram: 'CORAM: HON\'BLE MR. JUSTICE G. S. PATEL & HON\'BLE MS. JUSTICE NEELA GOKHALE',
      orderText: `1. Heard learned Senior Counsel for the parties.
2. Issue notice. Respondent JNPA waives service through counsel.
3. Subject to Appellant depositing ₹10 Crores in the Registry within two weeks, status quo as on date regarding invocation of the Bank Guarantee of ₹45 Crores shall be maintained till the next date of hearing.`,
      nextHearingDate: '2026-08-25',
      directions: [
        'Deposit ₹10 Crores in High Court Registry within 14 days',
        'Maintain Status Quo on Bank Guarantee encashment'
      ],
      status: 'DRAFT'
    },

    consistencyAnalysis: {
      consistencyScore: 88,
      alignmentStatus: 'ALIGNED',
      explanation: 'In 88% of commercial arbitration appeals involving port concession agreements where performance shortfalls were linked to government-managed dredging delays or Force Majeure monsoonal storms, courts granted interim stays against bank guarantee calls pending tribunal constitution.',
      isOutlier: false,
      similarPrecedents: [
        {
          caseId: 'prec_007',
          caseTitle: 'Associate Builders v. Delhi Development Authority',
          caseNumber: '(2015) 3 SCC 49',
          court: 'Supreme Court of India',
          offenseSections: ['Section 34 / 37 Arb Act'],
          custodyPeriod: 'N/A',
          outcome: 'Arbitrary Action Nullified',
          similarityScore: 92,
          keyDivergenceOrParity: 'Fundamental policy of Indian law protects concessionaires against arbitrary state cancellation.'
        },
        {
          caseId: 'prec_008',
          caseTitle: 'ONGC Ltd. v. Saw Pipes Ltd.',
          caseNumber: '(2003) 5 SCC 705',
          court: 'Supreme Court of India',
          offenseSections: ['Section 9 Arb Act'],
          custodyPeriod: 'N/A',
          outcome: 'Force Majeure Relief',
          similarityScore: 89,
          keyDivergenceOrParity: 'Force majeure weather disruptions exempt concessionaires from liquidated penalty clauses.'
        }
      ],
      groundedFactors: [
        {
          factor: 'Force Majeure Documentation',
          status: 'PARITY',
          details: 'Official JNPA port logs confirm monsoonal cyclone disruptions and dredging channel delays.',
          sourceParagraphId: 3,
          comparedCaseRef: 'ONGC v. Saw Pipes Ltd.'
        },
        {
          factor: 'Bank Guarantee Invocation',
          status: 'DISPARITY',
          details: 'Pre-arbitration call on ₹45 Crore guarantee risks irreparable injury before tribunal formation.',
          sourceParagraphId: 4,
          comparedCaseRef: 'Associate Builders v. DDA'
        }
      ]
    },

    plainLanguageSummary: [
      {
        id: 'p1',
        sentence: 'Adani Logistics is appealing a commercial court order after JNPA Port cancelled their container terminal operating agreement.',
        sourceParagraphId: 1,
        confidence: 98,
        category: 'PROCEDURAL',
        excerpt: 'impugns order dated 10th April 2026... under Section 9 refusing interim protection'
      },
      {
        id: 'p2',
        sentence: 'The Port Authority issued a termination letter claiming the terminal handled less annual cargo than promised in their contract.',
        sourceParagraphId: 2,
        confidence: 96,
        category: 'FACTS',
        excerpt: 'issued a termination notice dated 28th March 2026 citing alleged shortfall in Guaranteed Minimum Annual Cargo Throughput'
      },
      {
        id: 'p3',
        sentence: 'The company explained that cargo numbers fell because of severe ocean cyclones and because the Port Authority itself failed to deepen the water channels on time.',
        sourceParagraphId: 3,
        confidence: 97,
        category: 'KEY_CLAIM',
        excerpt: 'cargo shortfall was directly caused by Force Majeure events... and nav-channel dredging delays managed solely by Port Authority'
      },
      {
        id: 'p4',
        sentence: 'They are asking the court to stop the Port Authority from taking ₹45 Crores from their bank guarantee until an independent arbitration panel resolves the dispute.',
        sourceParagraphId: 4,
        confidence: 96,
        category: 'ARGUMENTS',
        excerpt: 'refusing injunction against invocation of the Performance Bank Guarantee of ₹45 Crores'
      }
    ]
  },

  {
    id: 'case_dl_2026_902',
    caseNumber: 'Writ Petition (Civil) No. 3105/2026',
    title: 'Senior Citizens Welfare Association v. Union of India & Ors.',
    petitioner: 'Senior Citizens Welfare Association',
    respondent: 'Union of India & Ors.',
    court: 'High Court of Delhi',
    filingDate: '2026-07-01',
    nextHearingDate: '2026-07-30',
    judgeBench: 'Bench of Hon\'ble Chief Justice & Hon\'ble Mr. Justice Sanjeev Narula',
    caseType: 'WRIT_PETITION',
    status: 'UNDER_HEARING',
    uploadedAt: '2026-07-05T11:20:00Z',
    uploadedBy: 'Advocate Ananya Roy',
    fileType: 'PDF',

    rawText: `IN THE HIGH COURT OF DELHI AT NEW DELHI
WRIT PETITION (CIVIL) NO. 3105 OF 2026

IN THE MATTER OF:
Senior Citizens Welfare Association ... Petitioner
Versus
Union of India & Ors. ... Respondents

PUBLIC INTEREST LITIGATION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA

Paragraph 1:
This Public Interest Litigation (PIL) has been instituted by the Senior Citizens Welfare Association under Article 226 of the Constitution of India seeking urgent directions to the Government of NCT of Delhi and Municipal Corporation of Delhi (MCD) for immediate operationalization of specialized geriatric care wards in all 38 government hospitals.

Paragraph 2:
The petitioner highlights that despite the statutory mandate under Section 20 of the Maintenance and Welfare of Parents and Senior Citizens Act, 2007, over 80% of government hospitals in the national capital lack dedicated beds, free diagnostic facilities, or separate queues for octogenarians.

Paragraph 3:
Deteriorating air quality and heatwave emergencies in Delhi during May-June 2026 resulted in over 450 preventable elderly admissions with severe respiratory distress being turned away due to lack of ICU beds reserved for senior citizens.

Paragraph 4:
It is submitted that right to emergency healthcare for elderly citizens forms an integral core of the Right to Life guaranteed under Article 21 of the Constitution of India, as affirmed in Paschim Banga Khet Mazdoor Samity v. State of W.B. (1996) 4 SCC 37.`,

    paragraphs: [
      { id: 1, text: 'This Public Interest Litigation (PIL) has been instituted by the Senior Citizens Welfare Association under Article 226 of the Constitution of India seeking urgent directions to the Government of NCT of Delhi and Municipal Corporation of Delhi (MCD) for immediate operationalization of specialized geriatric care wards in all 38 government hospitals.' },
      { id: 2, text: 'The petitioner highlights that despite the statutory mandate under Section 20 of the Maintenance and Welfare of Parents and Senior Citizens Act, 2007, over 80% of government hospitals in the national capital lack dedicated beds, free diagnostic facilities, or separate queues for octogenarians.' },
      { id: 3, text: 'Deteriorating air quality and heatwave emergencies in Delhi during May-June 2026 resulted in over 450 preventable elderly admissions with severe respiratory distress being turned away due to lack of ICU beds reserved for senior citizens.' },
      { id: 4, text: 'It is submitted that right to emergency healthcare for elderly citizens forms an integral core of the Right to Life guaranteed under Article 21 of the Constitution of India, as affirmed in Paschim Banga Khet Mazdoor Samity v. State of W.B. (1996) 4 SCC 37.' }
    ],

    summary: {
      sentences: [
        {
          id: 's1',
          sentence: 'PIL filed under Article 226 seeking mandatory geriatric wards and reserved ICU beds across 38 Delhi government hospitals.',
          sourceParagraphId: 1,
          confidence: 99,
          category: 'PROCEDURAL',
          excerpt: 'PIL... seeking urgent directions... for immediate operationalization of specialized geriatric care wards'
        },
        {
          id: 's2',
          sentence: '80% of state hospitals remain non-compliant with Section 20 statutory mandates of Senior Citizens Act 2007.',
          sourceParagraphId: 2,
          confidence: 97,
          category: 'KEY_CLAIM',
          excerpt: 'despite statutory mandate under Section 20... over 80% of government hospitals... lack dedicated beds'
        },
        {
          id: 's3',
          sentence: '450+ elderly patients suffered severe respiratory emergencies without access to reserved emergency care during heatwaves.',
          sourceParagraphId: 3,
          confidence: 95,
          category: 'FACTS',
          excerpt: 'resulted in over 450 preventable elderly admissions with severe respiratory distress being turned away'
        },
        {
          id: 's4',
          sentence: 'Invokes Article 21 Right to Life and Supreme Court ruling in Paschim Banga Khet Mazdoor Samity on state medical duty.',
          sourceParagraphId: 4,
          confidence: 98,
          category: 'RATIO',
          excerpt: 'Right to emergency healthcare... forms integral core of Right to Life guaranteed under Article 21'
        }
      ],
      keyTakeaways: [
        'Enforcement of Section 20 Senior Citizens Act 2007',
        'Constitutional Right to Healthcare under Article 21',
        'Direct impact on Delhi elderly public healthcare infrastructure'
      ],
      proceduralHistory: 'Filed July 1, 2026. High Court issued preliminary notice to GNCTD Health Dept.'
    },

    urgency: {
      level: 'HIGH',
      score: 88,
      reasons: [
        'Public Interest Litigation impacting senior citizen emergency health rights',
        'Non-compliance with statutory provisions of Senior Citizens Act 2007',
        'Ongoing public heatwave medical admissions crisis'
      ],
      keyFactors: {
        isBailApplication: false,
        hasMedicalEmergency: true,
        isSeniorCitizen: true,
        isLimitationExpiring: false,
        constitutionalRightsAtStake: true
      }
    },

    citationGraph: {
      nodes: [
        {
          id: 'CURRENT_CASE',
          title: 'WP(C) 3105/2026 (Senior Citizens Assn. v. UOI)',
          type: 'PRECEDENT',
          category: 'Current Case',
          relevance: 'PIL for Geriatric Healthcare Infrastructure',
          status: 'APPLICABLE'
        },
        {
          id: 'CONST_ART_21',
          title: 'Article 21 Constitution of India',
          type: 'ARTICLE',
          category: 'Constitution',
          relevance: 'Right to Life includes right to emergency medical care.',
          summary: 'State has primary constitutional duty to preserve human life through public medical care.'
        },
        {
          id: 'CASE_PASCHIM_BANGA',
          title: 'Paschim Banga Khet Mazdoor Samity v. State of WB (1996) 4 SCC 37',
          type: 'PRECEDENT',
          category: 'Supreme Court Landmark',
          relevance: 'Failure to provide timely medical treatment to patient in government hospital violates Article 21.',
          status: 'GOOD_LAW',
          summary: 'Supreme Court held government hospitals are constitutionally obligated to provide immediate medical assistance.'
        }
      ],
      edges: [
        { source: 'CURRENT_CASE', target: 'CONST_ART_21', label: 'Constitutional Basis' },
        { source: 'CURRENT_CASE', target: 'CASE_PASCHIM_BANGA', label: 'Relies Upon' }
      ]
    },

    draftOrder: {
      id: 'ord_3105_2026',
      caseId: 'case_dl_2026_902',
      title: 'DRAFT ORDER — DIRECTIVE TO HEALTH DEPARTMENT',
      courtName: 'IN THE HIGH COURT OF DELHI AT NEW DELHI',
      coram: 'CORAM: HON\'BLE THE CHIEF JUSTICE & HON\'BLE MR. JUSTICE SANJEEV NARULA',
      orderText: `1. Notice issued to Secretary (Health), GNCTD and MCD Commissioner.
2. Respondents shall file a status report within two weeks specifying:
   a) Number of functioning geriatric beds across 38 government hospitals.
   b) Steps taken to implement Section 20 of the Senior Citizens Act 2007.
3. In the interim, all government hospitals in Delhi are directed to ensure dedicated emergency triage lines for citizens above 70 years of age.`,
      nextHearingDate: '2026-08-14',
      directions: [
        'File Compliance Status Report within 14 days',
        'Establish Immediate Priority Triage for Citizens above 70 years'
      ],
      status: 'DRAFT'
    }
  },

  {
    id: 'case_up_2026_019',
    caseNumber: 'Criminal Appeal No. 711/2026',
    title: 'Virendra Singh v. State of Uttar Pradesh',
    petitioner: 'Virendra Singh',
    respondent: 'State of Uttar Pradesh',
    court: 'High Court of Judicature at Allahabad',
    filingDate: '2026-04-10',
    nextHearingDate: '2026-08-18',
    judgeBench: 'Bench of Hon\'ble Mr. Justice Arvind Kumar Mishra',
    caseType: 'CRIMINAL_APPEAL',
    status: 'PENDING',
    uploadedAt: '2026-06-25T15:00:00Z',
    uploadedBy: 'S. K. Verma',
    fileType: 'PDF',

    rawText: `IN THE HIGH COURT OF JUDICATURE AT ALLAHABAD
CRIMINAL APPELLATE JURISDICTION
CRIMINAL APPEAL NO. 711 OF 2026

Virendra Singh ... Appellant
Versus
State of Uttar Pradesh ... Respondent

APPEAL UNDER SECTION 374(2) Cr.P.C. AGAINST CONVICTION UNDER SECTION 302 IPC

Paragraph 1:
This criminal appeal challenges judgment dated 15th March 2026 passed by the learned Additional Sessions Judge, Varanasi convicting the appellant under Section 302 IPC and sentencing him to imprisonment for life in Sessions Trial No. 190/2022.

Paragraph 2:
The prosecution case rests entirely on circumstantial evidence regarding the alleged murder of one Ramesh Yadav over an agricultural land boundary dispute on the night of 14th August 2022.

Paragraph 3:
Appellant submits that the conviction is unsustainable in law as the chain of circumstantial evidence is completely broken. Independent eyewitness PW-3 turned hostile, and the alleged blood-stained lathi recovery under Section 27 Evidence Act was made from an open agricultural field accessible to the public 12 days after the incident.

Paragraph 4:
Under the authoritative ruling in Sharad Birdhichand Sarda v. State of Maharashtra (1984) 4 SCC 116, every hypothesis of innocence must be excluded before convicting on circumstantial proof. Suspicion, however grave, cannot substitute judicial proof.`,

    paragraphs: [
      { id: 1, text: 'This criminal appeal challenges judgment dated 15th March 2026 passed by the learned Additional Sessions Judge, Varanasi convicting the appellant under Section 302 IPC and sentencing him to imprisonment for life in Sessions Trial No. 190/2022.' },
      { id: 2, text: 'The prosecution case rests entirely on circumstantial evidence regarding the alleged murder of one Ramesh Yadav over an agricultural land boundary dispute on the night of 14th August 2022.' },
      { id: 3, text: 'Appellant submits that the conviction is unsustainable in law as the chain of circumstantial evidence is completely broken. Independent eyewitness PW-3 turned hostile, and the alleged blood-stained lathi recovery under Section 27 Evidence Act was made from an open agricultural field accessible to the public 12 days after the incident.' },
      { id: 4, text: 'Under the authoritative ruling in Sharad Birdhichand Sarda v. State of Maharashtra (1984) 4 SCC 116, every hypothesis of innocence must be excluded before convicting on circumstantial proof. Suspicion, however grave, cannot substitute judicial proof.' }
    ],

    summary: {
      sentences: [
        {
          id: 's1',
          sentence: 'Criminal appeal under Sec 374(2) CrPC against life imprisonment conviction under Section 302 IPC passed by Varanasi Sessions Court.',
          sourceParagraphId: 1,
          confidence: 99,
          category: 'PROCEDURAL',
          excerpt: 'challenges judgment... convicting the appellant under Section 302 IPC and sentencing him to imprisonment for life'
        },
        {
          id: 's2',
          sentence: 'Case hinges purely on circumstantial evidence arising from land boundary dispute.',
          sourceParagraphId: 2,
          confidence: 96,
          category: 'FACTS',
          excerpt: 'prosecution case rests entirely on circumstantial evidence regarding alleged murder'
        },
        {
          id: 's3',
          sentence: 'Key witness PW-3 turned hostile and Section 27 weapon recovery is tainted by 12-day delay in open accessible field.',
          sourceParagraphId: 3,
          confidence: 97,
          category: 'KEY_CLAIM',
          excerpt: 'eyewitness PW-3 turned hostile, and alleged blood-stained lathi recovery... made from open agricultural field'
        },
        {
          id: 's4',
          sentence: 'Relies on Sharad Birdhichand Sarda establishing five golden principles of circumstantial evidence.',
          sourceParagraphId: 4,
          confidence: 99,
          category: 'RATIO',
          excerpt: 'Under authoritative ruling in Sharad Birdhichand Sarda... every hypothesis of innocence must be excluded'
        }
      ],
      keyTakeaways: [
        'Broken chain of circumstantial evidence',
        'Hostile eyewitness & invalid Sec 27 recovery',
        'Precedent Sharad Birdhichand Sarda applied'
      ],
      proceduralHistory: 'Convicted March 15, 2026. Appeal admitted in Allahabad HC.'
    },

    urgency: {
      level: 'MEDIUM',
      score: 62,
      reasons: [
        'Regular Criminal Appeal involving Life Conviction sentence suspension prayer',
        'Appellant in custody following trial court conviction',
        'No impending statutory limitation expiration'
      ],
      keyFactors: {
        isBailApplication: false,
        hasMedicalEmergency: false,
        isSeniorCitizen: false,
        isLimitationExpiring: false,
        constitutionalRightsAtStake: true
      }
    },

    citationGraph: {
      nodes: [
        {
          id: 'CURRENT_CASE',
          title: 'Crl Appeal 711/2026 (Virendra Singh v. State of UP)',
          type: 'PRECEDENT',
          category: 'Current Case',
          relevance: 'Appeal against Sec 302 IPC Conviction',
          status: 'APPLICABLE'
        },
        {
          id: 'IPC_302',
          title: 'Section 302 IPC / Section 103 BNS',
          type: 'SECTION',
          category: 'Statute (IPC/BNS)',
          relevance: 'Punishment for Murder',
          summary: 'Mandates death or imprisonment for life along with fine.'
        },
        {
          id: 'CASE_SHARAD_BIRDHICHAND',
          title: 'Sharad Birdhichand Sarda v. State of Maharashtra (1984) 4 SCC 116',
          type: 'PRECEDENT',
          category: 'Supreme Court Landmark',
          relevance: 'Panchsheel / Five Golden Rules for conviction on circumstantial evidence.',
          status: 'GOOD_LAW',
          summary: 'The circumstances from which conclusion of guilt is drawn must be fully established and forming complete unbroken chain.'
        }
      ],
      edges: [
        { source: 'CURRENT_CASE', target: 'IPC_302', label: 'Convicted Under' },
        { source: 'CURRENT_CASE', target: 'CASE_SHARAD_BIRDHICHAND', label: 'Circumstantial Test' }
      ]
    },

    draftOrder: {
      id: 'ord_711_2026',
      caseId: 'case_up_2026_019',
      title: 'DRAFT ORDER — ADMISSION & LOWER COURT RECORDS CALL',
      courtName: 'IN THE HIGH COURT OF JUDICATURE AT ALLAHABAD',
      coram: 'CORAM: HON\'BLE MR. JUSTICE ARVIND KUMAR MISHRA',
      orderText: `1. Appeal admitted.
2. Call for the Lower Court Record (LCR) from the Sessions Court, Varanasi within three weeks.
3. List the application for suspension of sentence under Section 389 Cr.P.C. immediately upon receipt of LCR.`,
      nextHearingDate: '2026-08-30',
      directions: [
        'Requisition Lower Court Records from ASJ Varanasi',
        'List Bail/Suspension application post LCR receipt'
      ],
      status: 'DRAFT'
    }
  }
];

export const MOCK_ANALYTICS: CourtAnalytics = {
  totalPendingCases: 84210,
  avgSummaryTimeMinutes: 2.4,
  urgencyBreakdown: {
    critical: 1240,
    high: 8450,
    medium: 29120,
    low: 45400
  },
  urgencyMonthlyTrend: [
    { month: 'Jan', critical: 780, high: 6200, medium: 22100, low: 38900 },
    { month: 'Feb', critical: 890, high: 6800, medium: 23800, low: 40200 },
    { month: 'Mar', critical: 960, high: 7100, medium: 25100, low: 41800 },
    { month: 'Apr', critical: 1040, high: 7500, medium: 26400, low: 42900 },
    { month: 'May', critical: 1110, high: 7900, medium: 27500, low: 43800 },
    { month: 'Jun', critical: 1180, high: 8200, medium: 28400, low: 44600 },
    { month: 'Jul', critical: 1240, high: 8450, medium: 29120, low: 45400 }
  ],
  backlogMonthlyTrend: [
    { month: 'Jan 2026', filed: 4200, disposed: 3800, backlog: 82100 },
    { month: 'Feb 2026', filed: 4400, disposed: 4100, backlog: 82400 },
    { month: 'Mar 2026', filed: 4600, disposed: 4500, backlog: 82500 },
    { month: 'Apr 2026', filed: 4100, disposed: 4300, backlog: 82300 },
    { month: 'May 2026', filed: 4800, disposed: 4600, backlog: 82500 },
    { month: 'Jun 2026', filed: 5100, disposed: 5300, backlog: 82300 },
    { month: 'Jul 2026', filed: 4900, disposed: 5200, backlog: 82000 }
  ],
  topCitedSections: [
    { section: 'Section 439 Cr.P.C. / Sec 483 BNSS', act: 'Code of Criminal Procedure / BNSS', count: 18420 },
    { section: 'Article 226 / Article 32', act: 'Constitution of India', count: 14200 },
    { section: 'Section 482 Cr.P.C. / Sec 528 BNSS', act: 'Code of Criminal Procedure / BNSS', count: 11950 },
    { section: 'Section 302 IPC / Sec 103 BNS', act: 'Indian Penal Code / BNS', count: 9810 },
    { section: 'Section 138 NI Act', act: 'Negotiable Instruments Act', count: 8740 },
    { section: 'Section 304A IPC / Sec 106 BNS', act: 'Indian Penal Code / BNS', count: 6520 },
    { section: 'Section 9 / Section 34', act: 'Arbitration & Conciliation Act', count: 5210 }
  ],
  courtPendency: [
    { court: 'High Court of Delhi', count: 18200, avgDaysPending: 340 },
    { court: 'High Court of Judicature at Bombay', count: 24500, avgDaysPending: 480 },
    { court: 'High Court of Judicature at Allahabad', count: 32100, avgDaysPending: 610 },
    { court: 'Supreme Court of India', count: 9410, avgDaysPending: 190 }
  ]
};
