/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient, getApiMode, getMockDb, API_BASE_URL } from './config';

const getMockWeeklyMeetingSummary = (projectId: string | number): { summary: string } => {
  const db = getMockDb();
  const proj = db.projects.find(p => String(p.id) === String(projectId));
  const projectName = proj ? proj.name : 'Selected Project';
  
  return {
    summary: `### WEEKLY MEETING SUMMARY: ${projectName.toUpperCase()}

#### 📅 Meetings Held This Week
- **Subcontractor Coordination Review (Tuesday, 09:00 AM)**: Alignment of plumbing and electrical schedules, site layout adjustments, and material deliveries.
- **Site HSE Briefing & Walkthrough (Thursday, 02:00 PM)**: Standard site safety review, concrete pour protocol safety checks.

#### ✅ Completed Meeting Types
- **Health, Safety & Environment (HSE)**: Morning toolbox talks completed with 100% staff sign-off.
- **Structural Engineering Sign-Off**: Cleared Zone B core drill alignments for immediate framing start.

#### ⚠️ Missing Meeting Types
- **Subcontractor Status Update (Missing)**: Electrics supervisor was delayed on an external site; meeting rescheduled for Monday.
- **Client Alignment Update (Missing)**: Bi-weekly developer progress meeting postponed to next week.

#### 💡 Actionable Recommendations
1. **Expedite structural drawings approval** to prevent immediate framing delay.
2. **Coordinate electrician schedules** during Monday's special briefing to ensure zero impact on plumbing milestones.
3. **Verify material delivery lanes** prior to concrete truck scheduling to bypass local supplier backlog issues.`
  };
};

export async function getWeeklyMeetingSummary(projectId: string | number): Promise<{ summary: string }> {
  if (getApiMode() === 'mock') {
    // Delay to simulate AI model Hermes running (approx 1.2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return getMockWeeklyMeetingSummary(projectId);
  }

  const urls = [
    `/api/v1/projects/${projectId}/weekly-summary`,
    `/api/v1/ai/meetings/weekly-summary/${projectId}`,
    `/ai/meetings/weekly-summary/${projectId}`,
  ];

  let lastError: any = null;
  for (const url of urls) {
    try {
      const response = await apiClient.get<any>(url);
      if (response && response.data) {
        if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
          continue; // skip HTML response
        }
        let summaryText = '';
        if (typeof response.data === 'string') {
          summaryText = response.data;
        } else if (response.data.summary && typeof response.data.summary === 'string') {
          summaryText = response.data.summary;
        } else if (response.data.content && typeof response.data.content === 'string') {
          summaryText = response.data.content;
        } else {
          // fallback search
          for (const key of Object.keys(response.data)) {
            if (typeof response.data[key] === 'string' && response.data[key].length > 10 && !response.data[key].trim().startsWith('<')) {
              summaryText = response.data[key];
              break;
            }
          }
        }
        if (summaryText) {
          return { summary: summaryText };
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to fetch weekly meeting summary for project ${projectId}`);
}
