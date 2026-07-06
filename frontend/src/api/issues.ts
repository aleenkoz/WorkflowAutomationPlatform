/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { axiosInstance, getApiMode, getMockDb, saveMockDb } from './config';
import { Issue } from '../types';

export const getIssues = async (projectId: string): Promise<Issue[]> => {
  if (getApiMode() === 'mock') {
    return getMockDb().issues.filter((i) => i.project_id === projectId);
  }
  const response = await axiosInstance.get<Issue[]>(`/projects/${projectId}/issues`);
  return response.data;
};

export const addIssue = async (projectId: string, issueData: Omit<Issue, 'id' | 'project_id'>): Promise<Issue> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const newIssue: Issue = {
      ...issueData,
      id: 'i_' + Date.now(),
      project_id: projectId,
    };
    db.issues.push(newIssue);
    saveMockDb(db);
    return newIssue;
  }
  const response = await axiosInstance.post<Issue>(`/projects/${projectId}/issues`, issueData);
  return response.data;
};

export const deleteIssue = async (issueId: string): Promise<void> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    db.issues = db.issues.filter((i) => i.id !== issueId);
    saveMockDb(db);
    return;
  }
  await axiosInstance.delete(`/issues/${issueId}`);
};
