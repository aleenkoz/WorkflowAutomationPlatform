/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { axiosInstance, getApiMode, getMockDb } from './config';
import { RiskDetectionResponse, ProjectSummaryResponse } from '../types';

export const detectRisks = async (): Promise<RiskDetectionResponse> => {
  if (getApiMode() === 'mock') {
    // Delay to simulate AI model Hermes running (approx. 1.2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    const db = getMockDb();
    const p1 = db.projects[0];
    const p2 = db.projects[1];

    return {
      total_emails: 124,
      risks_detected: 3,
      risks: [
        {
          id: 93,
          project_id: p1 ? p1.id : 'p1',
          email_id: 6009,
          risk_type: 'Coordination',
          severity: 'High',
          description: "The delay in submitting structural drawings is impacting the site team's framing milestone.",
          detected_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 94,
          project_id: p1 ? p1.id : 'p1',
          email_id: 6012,
          risk_type: 'Technical',
          severity: 'Medium',
          description: "Water pressure test failed on Zone B; concrete core drill is required to fix layout alignment.",
          detected_at: new Date(Date.now() - 12000000).toISOString(),
        },
        {
          id: 95,
          project_id: p2 ? p2.id : 'p2',
          email_id: 6100,
          risk_type: 'Supply Chain',
          severity: 'Low',
          description: "Local cement supplier reports a 3-day backlog of delivery vehicles.",
          detected_at: new Date(Date.now() - 25000000).toISOString(),
        },
      ],
    };
  }

  const response = await axiosInstance.post<any>('/ai/detect-risks');
  const data = response.data;
  if (data && Array.isArray(data.risks)) {
    data.risks = data.risks.map((r: any) => ({
      id: r.id,
      project_id: r.project_id,
      email_id: r.email_id,
      risk_type: r.risk_type,
      severity: r.severity,
      description: r.description,
      detected_at: r.detected_at,
    }));
  }
  return data;
};

export const getProjectsSummary = async (): Promise<ProjectSummaryResponse> => {
  if (getApiMode() === 'mock') {
    // Delay to simulate Hermes summary generator
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const db = getMockDb();
    const activeCount = db.projects.filter(p => p.status === 'Active').length;
    const planningCount = db.projects.filter(p => p.status === 'Planning').length;
    const holdCount = db.projects.filter(p => p.status === 'On Hold').length;

    let summaryText = `### CONSTRUCTION PROGRAM STATUS REPORT\n\n`;
    summaryText += `Currently, there are **${activeCount} Active**, **${planningCount} Planning**, and **${holdCount} On Hold** projects under management.\n\n`;
    
    db.projects.forEach((proj) => {
      const pPhases = db.phases.filter(ph => ph.project_id === proj.id);
      const activePhase = pPhases.find(ph => ph.status === 'In Progress')?.name || 'None';
      const openIssues = db.issues.filter(i => i.project_id === proj.id && i.status === 'Open').length;
      const criticalRisks = db.risks.filter(r => r.project_id === proj.id && r.status === 'Open' && r.impact === 'High').length;

      summaryText += `#### 🏗️ ${proj.name} (${proj.status})\n`;
      summaryText += `- **Client:** ${proj.client_name}\n`;
      summaryText += `- **Location:** ${proj.location}\n`;
      summaryText += `- **Current Phase:** ${activePhase}\n`;
      summaryText += `- **Status Brief:** ${proj.description.substring(0, 150)}...\n`;
      if (openIssues > 0 || criticalRisks > 0) {
        summaryText += `- **⚠️ Attention Required:** ${openIssues} open site issues and ${criticalRisks} critical supply/structural risks detected.\n`;
      } else {
        summaryText += `- **✅ Status:** Standard progress with no outstanding blockers.\n`;
      }
      summaryText += `\n`;
    });

    return {
      summary: summaryText,
    };
  }

  const response = await axiosInstance.get<ProjectSummaryResponse>('/ai/projects/summary');
  return response.data;
};
