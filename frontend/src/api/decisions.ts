/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient, getApiMode, getMockDb, saveMockDb, API_BASE_URL } from './config';
import { Decision } from '../types';

export const getDecisions = async (projectId: string | number): Promise<Decision[]> => {
  if (getApiMode() === 'mock') {
    return getMockDb().decisions.filter((d) => String(d.project_id) === String(projectId));
  }
  const response = await apiClient.get<Decision[]>(`/api/v1/projects/${projectId}/decisions`);
  return response.data;
};

export const addDecision = async (projectId: string | number, decisionData: Omit<Decision, 'id' | 'project_id'>): Promise<Decision> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const newDecision: Decision = {
      ...decisionData,
      id: 'd_' + Date.now(),
      project_id: String(projectId),
    };
    db.decisions.push(newDecision);
    saveMockDb(db);
    return newDecision;
  }
  const response = await apiClient.post<Decision>(`/api/v1/projects/${projectId}/decisions`, decisionData);
  return response.data;
};

export const updateDecision = async (
  projectId: string | number,
  decisionId: string | number,
  decisionData: Omit<Decision, 'id' | 'project_id'>
): Promise<Decision> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const idx = db.decisions.findIndex((d) => String(d.id) === String(decisionId));
    if (idx !== -1) {
      db.decisions[idx] = { ...decisionData, id: String(decisionId), project_id: String(projectId) };
      saveMockDb(db);
      return db.decisions[idx];
    }
    throw new Error('Decision not found');
  }
  const response = await apiClient.put<Decision>(
    `/api/v1/projects/${projectId}/decisions/${decisionId}`,
    decisionData
  );
  return response.data;
};

export const deleteDecision = async (projectId: string | number, decisionId: string | number): Promise<void> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    db.decisions = db.decisions.filter((d) => String(d.id) !== String(decisionId));
    saveMockDb(db);
    return;
  }
  await apiClient.delete(`/api/v1/projects/${projectId}/decisions/${decisionId}`);
};
