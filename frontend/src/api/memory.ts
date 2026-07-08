/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient, getApiMode, getMockDb, API_BASE_URL } from './config';

export interface MemoryEntry {
  id: string | number;
  project_id: string | number;
  entry_type: 'summary' | 'risk' | 'intelligence' | string;
  content: string;
  created_at: string;
  source_type: string;
  source_id: string | number;
}

const getMockMemory = (projectId: number | string, query?: string, entryType?: string): MemoryEntry[] => {
  const db = getMockDb();
  const proj = db.projects.find(p => String(p.id) === String(projectId));
  const prId = proj ? String(proj.id) : String(projectId);

  // Initial high-fidelity memory log for the demo mode
  const allEntries: MemoryEntry[] = [
    {
      id: 'mem1',
      project_id: prId,
      entry_type: 'summary',
      content: `Project kickoff and stakeholder alignment completed. Finalized core construction scope including 5-story mixed-use commercial structure aiming for LEED Gold certification. Site boundaries and excavation logistics approved.`,
      created_at: new Date(Date.now() - 30 * 24 * 3600000).toISOString(), // 30 days ago
      source_type: 'project',
      source_id: prId
    },
    {
      id: 'mem2',
      project_id: prId,
      entry_type: 'risk',
      content: `Critical Risk Detected: Structural engineering drawings delivery is 14 days behind schedule, putting the upcoming framing phase 3 critical path at serious risk of layout stall.`,
      created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(), // 5 days ago
      source_type: 'risk',
      source_id: 93
    },
    {
      id: 'mem3',
      project_id: prId,
      entry_type: 'intelligence',
      content: `AI Analysis: Steel framing path risk has been identified. Mitigation scenario suggests shifting structural engineer approvals and preparing off-site framing pre-fabrications to save up to 6 calendar days.`,
      created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), // 2 days ago
      source_type: 'intelligence',
      source_id: 'intel_01'
    },
    {
      id: 'mem4',
      project_id: prId,
      entry_type: 'risk',
      content: `On-Site layout failure: Water pressure test on Zone B failed, concrete core drill required to align layouts and avoid plumbing line conflicts.`,
      created_at: new Date(Date.now() - 1 * 24 * 3600000).toISOString(), // 1 day ago
      source_type: 'risk',
      source_id: 94
    },
    {
      id: 'mem5',
      project_id: prId,
      entry_type: 'summary',
      content: `Weekly meeting summarized. Subcontractor alignment reached on staggered schedules. Electrics status meeting postponed to Monday. Site Safety Toolbox session finished with full attendee compliance.`,
      created_at: new Date(Date.now() - 6 * 3600000).toISOString(), // 6 hours ago
      source_type: 'meeting',
      source_id: 'meet_99'
    }
  ];

  // Filter by project_id
  let filtered = allEntries.filter(e => String(e.project_id) === prId);

  // Filter by entry_type (if specified and not "all")
  if (entryType && entryType !== 'all') {
    filtered = filtered.filter(e => e.entry_type.toLowerCase() === entryType.toLowerCase());
  }

  // Filter by search query (if specified)
  if (query && query.trim() !== '') {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(e => e.content.toLowerCase().includes(qLower) || e.entry_type.toLowerCase().includes(qLower));
  }

  return filtered;
};

export async function searchMemory(
  projectId: number | string,
  query?: string,
  entryType?: string
): Promise<MemoryEntry[]> {
  if (getApiMode() === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getMockMemory(projectId, query, entryType);
  }

  // Live API Call
  const params: any = {};
  if (query) params.q = query;
  if (entryType && entryType !== 'all') params.entry_type = entryType;

  const urls = [
    `/api/v1/projects/${projectId}/memory`,
    `/api/v1/memory/search/${projectId}`,
    `/memory/search/${projectId}`,
  ];

  let lastError: any = null;
  for (const url of urls) {
    try {
      const response = await apiClient.get<any>(url, { params });
      if (response && response.data) {
        if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
          continue; // skip HTML response
        }
        if (Array.isArray(response.data)) {
          return response.data;
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to search memory for project ${projectId}`);
}
