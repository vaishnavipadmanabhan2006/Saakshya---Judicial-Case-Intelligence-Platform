import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CaseFile, DraftOrder, LanguageCode } from '../types';

/**
 * Renders an HTML element to a downloadable multi-page PDF using html2canvas & jsPDF.
 */
export async function downloadElementAsPDF(
  element: HTMLElement,
  filename: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  if (onProgress) onProgress(10);

  // High resolution scale for sharp text & graphics
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });

  if (onProgress) onProgress(60);

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  if (onProgress) onProgress(90);

  pdf.save(filename);

  if (onProgress) onProgress(100);
}

/**
 * Creates a clean hidden HTML container, populates it with a formal legal document layout,
 * and triggers PDF generation and download.
 */
export async function generateDraftOrderPDF(
  draftOrder: DraftOrder,
  caseFile: CaseFile,
  onProgress?: (status: string) => void
): Promise<void> {
  if (onProgress) onProgress('Preparing document layout...');

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '794px'; // ~A4 width at 96 DPI
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = 'Georgia, serif';
  container.style.padding = '48px';
  container.style.boxSizing = 'border-box';

  const isApproved = draftOrder.status === 'APPROVED';

  container.innerHTML = `
    <div style="border: 2px solid #0f172a; padding: 32px; min-height: 1000px; position: relative; background: #ffffff;">
      
      <!-- Watermark -->
      <div style="position: absolute; top: 35%; left: 10%; right: 10%; text-align: center; opacity: 0.04; pointer-events: none; font-size: 64px; font-weight: bold; transform: rotate(-30deg); letter-spacing: 4px; color: #000;">
        ${isApproved ? 'OFFICIAL JUDICIAL ORDER' : 'AI DRAFT - JUDICIAL REVIEW REQUIRED'}
      </div>

      <!-- Court Header -->
      <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px;">
        <div style="font-size: 11px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px; text-transform: uppercase; color: #475569; margin-bottom: 4px;">
          IN THE HIGH COURT OF JUDICATURE AT NEW DELHI
        </div>
        <div style="font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin-bottom: 6px;">
          ${draftOrder.courtName || caseFile.court}
        </div>
        <div style="font-size: 12px; font-family: Arial, sans-serif; color: #334155;">
          ${draftOrder.coram || caseFile.judgeBench || 'BEFORE THE BENCH OF HON\'BLE JUSTICES'}
        </div>
        <div style="margin-top: 12px; font-size: 13px; font-weight: bold; font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; padding: 6px; border: 1px solid #e2e8f0;">
          ${draftOrder.title || caseFile.title}
        </div>
      </div>

      <!-- Case Reference Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-family: Arial, sans-serif; font-size: 11px;">
        <tr>
          <td style="padding: 6px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: bold; width: 20%;">Case No:</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; width: 30%; font-weight: bold;">${caseFile.caseNumber}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: bold; width: 20%;">Filing Date:</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; width: 30%;">${caseFile.filingDate}</td>
        </tr>
        <tr>
          <td style="padding: 6px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: bold;">Petitioner:</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;">${caseFile.petitioner}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: bold;">Respondent:</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;">${caseFile.respondent}</td>
        </tr>
        <tr>
          <td style="padding: 6px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: bold;">Next Hearing:</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; color: #b45309; font-weight: bold;">${draftOrder.nextHearingDate}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: bold;">Status:</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;">
            <span style="background: ${isApproved ? '#dcfce7' : '#fef3c7'}; color: ${isApproved ? '#166534' : '#92400e'}; padding: 2px 8px; border-radius: 4px; font-weight: bold;">
              ${isApproved ? 'PASSED & SIGNED' : 'DRAFT ORDER'}
            </span>
          </td>
        </tr>
      </table>

      <!-- Order Title Header -->
      <div style="text-align: center; font-size: 14px; font-weight: bold; text-decoration: underline; margin-bottom: 20px; text-transform: uppercase;">
        ORDER / JUDGMENT
      </div>

      <!-- Order Text Content -->
      <div style="font-size: 13px; line-height: 1.8; text-align: justify; margin-bottom: 24px; white-space: pre-line; font-family: 'Times New Roman', Times, serif;">
        ${draftOrder.orderText}
      </div>

      <!-- Directions Section -->
      ${
        draftOrder.directions && draftOrder.directions.length > 0
          ? `
        <div style="margin-bottom: 24px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 14px; border-radius: 6px; font-family: Arial, sans-serif;">
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #0f172a; margin-bottom: 8px;">
            Specific Directions Issued by Court:
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 11px; line-height: 1.6; color: #334155;">
            ${draftOrder.directions.map((d) => `<li style="margin-bottom: 4px;">${d}</li>`).join('')}
          </ul>
        </div>
      `
          : ''
      }

      <!-- Confidential Bench Notes if present -->
      ${
        draftOrder.judgeNotes
          ? `
        <div style="margin-bottom: 24px; background: #fffbeb; border: 1px dashed #f59e0b; padding: 12px; font-family: Arial, sans-serif;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #b45309; margin-bottom: 4px;">
            Bench Notes / Confidential Instructions:
          </div>
          <div style="font-size: 11px; color: #78350f;">
            ${draftOrder.judgeNotes}
          </div>
        </div>
      `
          : ''
      }

      <!-- Signature & Footer Block -->
      <div style="margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; font-family: Arial, sans-serif;">
        <div style="font-size: 10px; color: #64748b;">
          <div>Generated by <strong>Saakshya AI Legal Engine</strong></div>
          <div>Verification Ref ID: <span style="font-family: monospace;">${draftOrder.id}</span></div>
          <div>Export Timestamp: ${new Date().toLocaleString('en-IN')}</div>
        </div>

        <div style="text-align: right;">
          ${
            isApproved
              ? `
            <div style="font-size: 14px; font-family: 'Times New Roman', serif; font-style: italic; color: #15803d; font-weight: bold; text-decoration: underline; margin-bottom: 4px;">
              ${draftOrder.approvedBy || "Hon'ble Mr. Justice R. S. Sharma"}
            </div>
            <div style="font-size: 11px; font-weight: bold; color: #0f172a;">
              JUDGE / PRESIDING OFFICER
            </div>
            <div style="font-size: 10px; color: #166534; margin-top: 2px;">
              Digitally Verified & Signed (${draftOrder.approvedAt || 'Official Seal'})
            </div>
          `
              : `
            <div style="font-size: 11px; color: #64748b; font-style: italic; border-top: 1px dashed #94a3b8; padding-top: 8px; width: 180px; text-align: center;">
              Signature / Approval Pending<br/>(Presiding Judicial Officer)
            </div>
          `
          }
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    if (onProgress) onProgress('Rendering PDF pages...');
    const filename = `${caseFile.caseNumber.replace(/[^a-zA-Z0-9]/g, '_')}_Draft_Order.pdf`;
    await downloadElementAsPDF(container, filename);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Generates an Executive Case Brief & Summary PDF for Lawyers.
 */
export async function generateCaseBriefPDF(
  caseFile: CaseFile,
  selectedLanguage: LanguageCode = 'en',
  languageName: string = 'English',
  onProgress?: (status: string) => void
): Promise<void> {
  if (onProgress) onProgress('Compiling case summary data...');

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '794px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.padding = '40px';
  container.style.boxSizing = 'border-box';

  const sentences =
    selectedLanguage !== 'en' && caseFile.translations?.[selectedLanguage]
      ? caseFile.translations[selectedLanguage]
      : caseFile.summary.sentences;

  // Group sentences by category
  const facts = sentences.filter((s) => s.category === 'FACTS');
  const argumentsList = sentences.filter((s) => s.category === 'ARGUMENTS' || s.category === 'KEY_CLAIM');
  const ratios = sentences.filter((s) => s.category === 'RATIO' || s.category === 'RULING');
  const procedural = sentences.filter((s) => s.category === 'PROCEDURAL');

  container.innerHTML = `
    <div style="border: 2px solid #1e293b; padding: 28px; background: #ffffff;">
      
      <!-- Top Legal Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-b: 2px solid #0f172a; pb: 12px; margin-bottom: 20px;">
        <div>
          <div style="font-size: 18px; font-weight: bold; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
            EXECUTIVE CASE BRIEF & GROUNDED SUMMARY
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            Prepared for Advocate Briefings & Judicial Record (${languageName})
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 10px; font-weight: bold; background: #0f172a; color: #ffffff; padding: 4px 10px; border-radius: 4px; display: inline-block;">
            SAAKSHYA LEGAL INTELLIGENCE
          </div>
        </div>
      </div>

      <!-- Case Primary Information -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-size: 15px; font-weight: bold; color: #0f172a; font-family: Georgia, serif; margin-bottom: 8px;">
          ${caseFile.title}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
          <div><strong>Case Number:</strong> ${caseFile.caseNumber}</div>
          <div><strong>Court / Bench:</strong> ${caseFile.court}</div>
          <div><strong>Petitioner:</strong> ${caseFile.petitioner}</div>
          <div><strong>Respondent:</strong> ${caseFile.respondent}</div>
          <div><strong>Filing Date:</strong> ${caseFile.filingDate}</div>
          <div><strong>Urgency Level:</strong> <span style="color: #b45309; font-weight: bold;">${caseFile.urgency.level} Priority (${caseFile.urgency.score}/100)</span></div>
        </div>
      </div>

      <!-- Key Takeaways -->
      ${
        caseFile.summary.keyTakeaways && caseFile.summary.keyTakeaways.length > 0
          ? `
        <div style="margin-bottom: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 8px;">
          <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #166534; margin-bottom: 8px;">
            ★ Core Judicial Takeaways
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 11px; line-height: 1.6; color: #14532d;">
            ${caseFile.summary.keyTakeaways.map((k) => `<li style="margin-bottom: 4px;">${k}</li>`).join('')}
          </ul>
        </div>
      `
          : ''
      }

      <!-- Grounded Analysis Sections -->
      <div style="margin-bottom: 20px;">
        <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 12px; color: #0f172a;">
          Grounded Analysis Breakdown
        </div>

        ${
          ratios.length > 0
            ? `
          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; font-weight: bold; color: #6b21a8; text-transform: uppercase; margin-bottom: 6px;">
              • Points of Law & Precedent Ratio (${ratios.length})
            </div>
            ${ratios
              .map(
                (r) => `
              <div style="background: #faf5ff; border-left: 3px solid #9333ea; padding: 8px 12px; margin-bottom: 6px; font-size: 11px;">
                <div style="font-weight: 500; color: #3b0764; margin-bottom: 4px;">${r.sentence}</div>
                <div style="font-size: 10px; color: #7e22ce;">Source: Paragraph ${r.sourceParagraphId} | Confidence: ${r.confidence}%</div>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }

        ${
          facts.length > 0
            ? `
          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; font-weight: bold; color: #1e40af; text-transform: uppercase; margin-bottom: 6px;">
              • Essential Case Facts (${facts.length})
            </div>
            ${facts
              .map(
                (f) => `
              <div style="background: #eff6ff; border-left: 3px solid #2563eb; padding: 8px 12px; margin-bottom: 6px; font-size: 11px;">
                <div style="font-weight: 500; color: #1e3a8a; margin-bottom: 4px;">${f.sentence}</div>
                <div style="font-size: 10px; color: #1d4ed8;">Source: Paragraph ${f.sourceParagraphId} | Confidence: ${f.confidence}%</div>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }

        ${
          argumentsList.length > 0
            ? `
          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; font-weight: bold; color: #92400e; text-transform: uppercase; margin-bottom: 6px;">
              • Main Arguments & Contentions (${argumentsList.length})
            </div>
            ${argumentsList
              .map(
                (a) => `
              <div style="background: #fffbeb; border-left: 3px solid #d97706; padding: 8px 12px; margin-bottom: 6px; font-size: 11px;">
                <div style="font-weight: 500; color: #78350f; margin-bottom: 4px;">${a.sentence}</div>
                <div style="font-size: 10px; color: #b45309;">Source: Paragraph ${a.sourceParagraphId} | Confidence: ${a.confidence}%</div>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }

        ${
          procedural.length > 0
            ? `
          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; font-weight: bold; color: #15803d; text-transform: uppercase; margin-bottom: 6px;">
              • Procedural History & Posture (${procedural.length})
            </div>
            ${procedural
              .map(
                (p) => `
              <div style="background: #f0fdf4; border-left: 3px solid #16a34a; padding: 8px 12px; margin-bottom: 6px; font-size: 11px;">
                <div style="font-weight: 500; color: #14532d; margin-bottom: 4px;">${p.sentence}</div>
                <div style="font-size: 10px; color: #15803d;">Source: Paragraph ${p.sourceParagraphId} | Confidence: ${p.confidence}%</div>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }
      </div>

      <!-- Key Statutes & Citations List -->
      ${
        caseFile.citationGraph?.nodes && caseFile.citationGraph.nodes.length > 0
          ? `
        <div style="margin-bottom: 20px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px;">
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #0f172a; margin-bottom: 6px;">
            Cited Statutes & Precedents Graph Summary
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 10px; color: #334155;">
            ${caseFile.citationGraph.nodes
              .map(
                (node) => `
              <div style="padding: 4px 6px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px;">
                <strong>${node.title}</strong> (${node.type})<br/>
                <span style="color: #64748b;">${node.relevance}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }

      <!-- Footer -->
      <div style="border-top: 1px solid #cbd5e1; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b;">
        <div>Saakshya Engine Grounded Verification System • Ref: ${caseFile.id}</div>
        <div>Downloaded on: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</div>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    if (onProgress) onProgress('Generating PDF document...');
    const filename = `${caseFile.caseNumber.replace(/[^a-zA-Z0-9]/g, '_')}_Executive_Summary.pdf`;
    await downloadElementAsPDF(container, filename);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Generates a comprehensive PDF Package combining Case Summary AND Draft Order Sheet.
 */
export async function generateFullCasePackagePDF(
  caseFile: CaseFile,
  draftOrder?: DraftOrder,
  selectedLanguage: LanguageCode = 'en',
  languageName: string = 'English',
  onProgress?: (status: string) => void
): Promise<void> {
  if (onProgress) onProgress('Compiling case summary and order sheet data...');

  const activeDraftOrder = draftOrder || caseFile.draftOrder;
  const isApproved = activeDraftOrder?.status === 'APPROVED';

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '794px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.padding = '40px';
  container.style.boxSizing = 'border-box';

  const sentences =
    selectedLanguage !== 'en' && caseFile.translations?.[selectedLanguage]
      ? caseFile.translations[selectedLanguage]
      : caseFile.summary.sentences;

  const facts = sentences.filter((s) => s.category === 'FACTS');
  const argumentsList = sentences.filter((s) => s.category === 'ARGUMENTS' || s.category === 'KEY_CLAIM');
  const ratios = sentences.filter((s) => s.category === 'RATIO' || s.category === 'RULING');

  container.innerHTML = `
    <div style="border: 2px solid #0f172a; padding: 28px; background: #ffffff;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #475569; margin-bottom: 4px;">
          IN THE HIGH COURT OF JUDICATURE AT NEW DELHI
        </div>
        <div style="font-size: 18px; font-weight: bold; text-transform: uppercase; color: #0f172a; margin-bottom: 6px;">
          ${activeDraftOrder?.courtName || caseFile.court}
        </div>
        <div style="font-size: 13px; font-weight: bold; color: #1e293b; background: #f1f5f9; padding: 6px; border: 1px solid #cbd5e1; display: inline-block;">
          COMPLETE CASE DOSSIER: SUMMARY & DRAFT ORDER
        </div>
      </div>

      <!-- Case Information Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
        <tr>
          <td style="padding: 6px; border: 1px solid #cbd5e1; background: #f8fafc; font-weight: bold; width: 20%;">Case Number:</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; width: 30%; font-weight: bold;">${caseFile.caseNumber}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; background: #f8fafc; font-weight: bold; width: 20%;">Filing Date:</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; width: 30%;">${caseFile.filingDate}</td>
        </tr>
        <tr>
          <td style="padding: 6px; border: 1px solid #cbd5e1; background: #f8fafc; font-weight: bold;">Petitioner:</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;">${caseFile.petitioner}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; background: #f8fafc; font-weight: bold;">Respondent:</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;">${caseFile.respondent}</td>
        </tr>
        <tr>
          <td style="padding: 6px; border: 1px solid #cbd5e1; background: #f8fafc; font-weight: bold;">Urgency Level:</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; color: #b45309; font-weight: bold;">${caseFile.urgency.level} (${caseFile.urgency.score}/100)</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; background: #f8fafc; font-weight: bold;">Order Status:</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;">
            <span style="background: ${isApproved ? '#dcfce7' : '#fef3c7'}; color: ${isApproved ? '#166534' : '#92400e'}; padding: 2px 8px; border-radius: 4px; font-weight: bold;">
              ${isApproved ? 'PASSED & SIGNED' : 'DRAFT ORDER'}
            </span>
          </td>
        </tr>
      </table>

      <!-- SECTION 1: GROUNDED CASE SUMMARY -->
      <div style="margin-bottom: 24px; border: 1px solid #0f172a; padding: 16px; background: #fafafa;">
        <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 4px; margin-bottom: 12px;">
          SECTION I: GROUNDED CASE BRIEF & SUMMARY (${languageName})
        </div>

        ${
          caseFile.summary.keyTakeaways?.length > 0
            ? `
          <div style="margin-bottom: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px; border-radius: 4px;">
            <div style="font-size: 11px; font-weight: bold; color: #166534; margin-bottom: 4px; text-transform: uppercase;">
              ★ Core Judicial Takeaways:
            </div>
            <ul style="margin: 0; padding-left: 18px; font-size: 11px; line-height: 1.5; color: #14532d;">
              ${caseFile.summary.keyTakeaways.map((k) => `<li>${k}</li>`).join('')}
            </ul>
          </div>
        `
            : ''
        }

        <!-- Ratios & Points of Law -->
        ${
          ratios.length > 0
            ? `
          <div style="margin-bottom: 10px;">
            <div style="font-size: 11px; font-weight: bold; color: #6b21a8; text-transform: uppercase; margin-bottom: 4px;">Points of Law / Precedent Ratio</div>
            ${ratios
              .map(
                (r) => `
              <div style="background: #faf5ff; border-left: 3px solid #9333ea; padding: 6px 10px; margin-bottom: 4px; font-size: 11px; color: #3b0764;">
                ${r.sentence} <span style="font-size: 9px; color: #7e22ce;">[Para ${r.sourceParagraphId}]</span>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }

        <!-- Facts -->
        ${
          facts.length > 0
            ? `
          <div style="margin-bottom: 10px;">
            <div style="font-size: 11px; font-weight: bold; color: #1e40af; text-transform: uppercase; margin-bottom: 4px;">Key Case Facts</div>
            ${facts
              .map(
                (f) => `
              <div style="background: #eff6ff; border-left: 3px solid #2563eb; padding: 6px 10px; margin-bottom: 4px; font-size: 11px; color: #1e3a8a;">
                ${f.sentence} <span style="font-size: 9px; color: #1d4ed8;">[Para ${f.sourceParagraphId}]</span>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }

        <!-- Arguments -->
        ${
          argumentsList.length > 0
            ? `
          <div style="margin-bottom: 10px;">
            <div style="font-size: 11px; font-weight: bold; color: #92400e; text-transform: uppercase; margin-bottom: 4px;">Main Arguments & Claims</div>
            ${argumentsList
              .map(
                (a) => `
              <div style="background: #fffbeb; border-left: 3px solid #d97706; padding: 6px 10px; margin-bottom: 4px; font-size: 11px; color: #78350f;">
                ${a.sentence} <span style="font-size: 9px; color: #b45309;">[Para ${a.sourceParagraphId}]</span>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }
      </div>

      <!-- SECTION 2: DRAFT ORDER SHEET -->
      ${
        activeDraftOrder
          ? `
        <div style="border: 1px solid #0f172a; padding: 16px; background: #ffffff;">
          <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 4px; margin-bottom: 12px;">
            SECTION II: FORMAL DRAFT ORDER / JUDGMENT
          </div>

          <div style="font-size: 12px; line-height: 1.8; text-align: justify; margin-bottom: 16px; white-space: pre-line; font-family: 'Times New Roman', Times, serif; color: #0f172a;">
            ${activeDraftOrder.orderText}
          </div>

          ${
            activeDraftOrder.directions?.length > 0
              ? `
            <div style="margin-bottom: 16px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 4px;">
              <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #0f172a; margin-bottom: 4px;">
                Specific Directions Issued:
              </div>
              <ul style="margin: 0; padding-left: 16px; font-size: 10px; line-height: 1.5; color: #334155;">
                ${activeDraftOrder.directions.map((d) => `<li>${d}</li>`).join('')}
              </ul>
            </div>
          `
              : ''
          }

          ${
            activeDraftOrder.judgeNotes
              ? `
            <div style="margin-bottom: 16px; background: #fffbeb; border: 1px dashed #f59e0b; padding: 10px; border-radius: 4px;">
              <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #b45309; margin-bottom: 2px;">
                Judicial Bench Notes:
              </div>
              <div style="font-size: 10px; color: #78350f;">
                ${activeDraftOrder.judgeNotes}
              </div>
            </div>
          `
              : ''
          }

          <!-- Signature block -->
          <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 14px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="font-size: 9px; color: #64748b;">
              Saakshya Engine Certified | Case Ref: ${caseFile.id}
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; font-family: 'Times New Roman', serif; font-weight: bold; color: #0f172a;">
                ${activeDraftOrder.approvedBy || "Hon'ble Presiding Officer"}
              </div>
              <div style="font-size: 10px; color: #475569;">
                HIGH COURT OF JUDICATURE
              </div>
            </div>
          </div>
        </div>
      `
          : ''
      }

      <!-- Footer -->
      <div style="margin-top: 20px; border-top: 1px solid #cbd5e1; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #64748b;">
        <div>Saakshya AI Legal Platform • Full Case Package</div>
        <div>Generated on: ${new Date().toLocaleString('en-IN')}</div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    if (onProgress) onProgress('Rendering Case Package PDF...');
    const filename = `${caseFile.caseNumber.replace(/[^a-zA-Z0-9]/g, '_')}_Case_Package.pdf`;
    await downloadElementAsPDF(container, filename);
  } finally {
    document.body.removeChild(container);
  }
}
