/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient, getApiMode, getMockDb, saveMockDb, API_BASE_URL } from './config';
import { Issue } from '../types';

export const getIssues = async (projectId: string | number): Promise<Issue[]> => {
  if (getApiMode() === 'mock') {
    return getMockDb().issues.filter((i) => String(i.project_id) === String(projectId));
  }
  const response = await apiClient.get<Issue[]>(`/api/v1/projects/${projectId}/issues`);
  return response.data;
};

export const addIssue = async (projectId: string | number, issueData: Omit<Issue, 'id' | 'project_id'>): Promise<Issue> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const newIssue: Issue = {
      ...issueData,
      id: 'i_' + Date.now(),
      project_id: String(projectId),
    };
    db.issues.push(newIssue);
    saveMockDb(db);
    return newIssue;
  }
  const response = await apiClient.post<Issue>(`/api/v1/projects/${projectId}/issues`, issueData);
  return response.data;
};

export const updateIssue = async (
  projectId: string | number,
  issueId: string | number,
  issueData: Omit<Issue, 'id' | 'project_id'>
): Promise<Issue> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const idx = db.issues.findIndex((i) => String(i.id) === String(issueId));
    if (idx !== -1) {
      db.issues[idx] = { ...issueData, id: String(issueId), project_id: String(projectId) };
      saveMockDb(db);
      return db.issues[idx];
    }
    throw new Error('Issue not found');
  }
  const response = await apiClient.put<Issue>(
    `/api/v1/projects/${projectId}/issues/${issueId}`,
    issueData
  );
  return response.data;
};

export const deleteIssue = async (projectId: string | number, issueId: string | number): Promise<void> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    db.issues = db.issues.filter((i) => String(i.id) !== String(issueId));
    saveMockDb(db);
    return;
  }
  await apiClient.delete(`/api/v1/projects/${projectId}/issues/${issueId}`);
};
