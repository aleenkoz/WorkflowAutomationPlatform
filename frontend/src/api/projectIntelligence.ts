/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient, getApiMode, getMockDb, API_BASE_URL } from './config';

export interface ProjectIntelligenceResponse {
  summary: string;
  updated_at: string;
}

const getMockIntelligence = (projectId: number | string, isRegen = false): ProjectIntelligenceResponse => {
  const db = getMockDb();
  const proj = db.projects.find(p => String(p.id) === String(projectId));
  const projectName = proj ? proj.name : 'Project';

  if (isRegen) {
    return {
      summary: `### REGENERATED PROJECT INTELLIGENCE: ${projectName.toUpperCase()}

#### 🧠 Dynamic Analysis & Risk Exposure
- **Steel Framing Schedule Slip**: High path risk for **Steel Framing (Phase 3)** has been slightly mitigated by preparing pre-fabrication layouts offsite. Projected delay reduced to **6 calendar days**.
- **On-Site Operational Clash**: Zone B core drill templates are finalized. Plumbing test schedules have been successfully staggered.
- **Supplier Volatility**: Alternative regional supplier has confirmed delivery capacity, reducing cement delay risk index to Low.

#### 💡 Suggested Action Items
1. **Finalize subcontractor sign-off** on the staggered plumbing/core drill schedule on Monday morning.
2. **Monitor pre-fabrication steel assembly** at the offsite facility to ensure immediate delivery upon structural framing clearance.`,
      updated_at: new Date().toISOString()
    };
  }

  return {
    summary: `### PROJECT INTELLIGENCE REPORT: ${projectName.toUpperCase()}

#### 🧠 Dynamic Analysis & Risk Exposure
- **Steel Framing Schedule Slip**: There is a high critical path risk for **Steel Framing (Phase 3)** due to late structural engineering approval. Current delay estimate is **12 calendar days**.
- **On-Site Operational Clash**: Zone B core drill requires specialized scheduling. If scheduled concurrently with the plumbing water tests, it will create site congestion.
- **Supplier Volatility**: Regional cement supplier backlog has eased, but remains at a 2-day delay index. 

#### 💡 Suggested Action Items
1. **Authorize immediate mobilization** of secondary layout alignment surveyors.
2. **Shift Zone B core drill** to a night shift or weekend window to avoid trade congestion.
3. **Escalate structural framing submittals** to the lead engineer by end of day Tuesday.`,
    updated_at: new Date(Date.now() - 3600000).toISOString()
  };
};

function extractSummary(data: any): string {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (data.summary && typeof data.summary === 'string') return data.summary;
  if (data.intelligence && typeof data.intelligence === 'string') return data.intelligence;
  if (data.analysis && typeof data.analysis === 'string') return data.analysis;
  if (data.content && typeof data.content === 'string') return data.content;
  if (data.data) {
    if (typeof data.data === 'string') return data.data;
    if (data.data.summary && typeof data.data.summary === 'string') return data.data.summary;
    if (data.data.intelligence && typeof data.data.intelligence === 'string') return data.data.intelligence;
    if (data.data.content && typeof data.data.content === 'string') return data.data.content;
  }
  
  // Look for any string property with substantial length as a fallback
  for (const key of Object.keys(data)) {
    if (typeof data[key] === 'string' && data[key].length > 10 && !data[key].trim().startsWith('<')) {
      return data[key];
    }
  }
  return '';
}

export async function getProjectIntelligence(projectId: number | string): Promise<ProjectIntelligenceResponse> {
  if (getApiMode() === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return getMockIntelligence(projectId);
  }

  const urls = [
    `/api/v1/projects/${projectId}/intelligence`,
    `/api/v1/ai/projects/intelligence/${projectId}`,
    `/api/v1/ai/project-summary/${projectId}`,
    `/ai/projects/intelligence/${projectId}`,
  ];

  let lastError: any = null;
  for (const url of urls) {
    try {
      const response = await apiClient.get<any>(url);
      if (response && response.data) {
        if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
          continue; // skip HTML response
        }
        const extracted = extractSummary(response.data);
        if (extracted) {
          return {
            summary: extracted,
            updated_at: response.data.updated_at || response.data.created_at || new Date().toISOString()
          };
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to fetch project intelligence for project ${projectId}`);
}

export async function regenerateProjectIntelligence(projectId: number | string): Promise<ProjectIntelligenceResponse> {
  if (getApiMode() === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return getMockIntelligence(projectId, true);
  }

  const urls = [
    `/api/v1/projects/${projectId}/intelligence`,
    `/api/v1/ai/projects/intelligence/${projectId}`,
    `/api/v1/ai/project-summary/${projectId}`,
    `/ai/projects/intelligence/${projectId}`,
  ];

  let lastError: any = null;
  for (const url of urls) {
    try {
      const response = await apiClient.post<any>(url);
      if (response && response.data) {
        if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
          continue; // skip HTML response
        }
        const extracted = extractSummary(response.data);
        if (extracted) {
          return {
            summary: extracted,
            updated_at: response.data.updated_at || response.data.created_at || new Date().toISOString()
          };
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to regenerate project intelligence for project ${projectId}`);
}
