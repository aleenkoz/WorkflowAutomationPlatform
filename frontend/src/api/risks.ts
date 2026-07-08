/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { axiosInstance, getApiMode, getMockDb, saveMockDb, API_BASE_URL } from './config';
import { Risk } from '../types';

export const getRisks = async (projectId: string | number): Promise<Risk[]> => {
  if (getApiMode() === 'mock') {
    return getMockDb().risks.filter((r) => String(r.project_id) === String(projectId));
  }
  const response = await axiosInstance.get<Risk[]>(`/api/v1/projects/${projectId}/risks`);
  return response.data;
};

export const addRisk = async (projectId: string | number, riskData: Omit<Risk, 'id' | 'project_id'>): Promise<Risk> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const newRisk: Risk = {
      ...riskData,
      id: 'r_' + Date.now(),
      project_id: String(projectId),
    };
    db.risks.push(newRisk);
    saveMockDb(db);
    return newRisk;
  }
  const response = await axiosInstance.post<Risk>(`/api/v1/projects/${projectId}/risks`, riskData);
  return response.data;
};

export const updateRisk = async (
  projectId: string | number,
  riskId: string | number,
  riskData: Omit<Risk, 'id' | 'project_id'>
): Promise<Risk> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const idx = db.risks.findIndex((r) => String(r.id) === String(riskId));
    if (idx !== -1) {
      db.risks[idx] = { ...riskData, id: String(riskId), project_id: String(projectId) };
      saveMockDb(db);
      return db.risks[idx];
    }
    throw new Error('Risk not found');
  }
  const response = await axiosInstance.put<Risk>(
    `/api/v1/projects/${projectId}/risks/${riskId}`,
    riskData
  );
  return response.data;
};

export const deleteRisk = async (projectId: string | number, riskId: string | number): Promise<void> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    db.risks = db.risks.filter((r) => String(r.id) !== String(riskId));
    saveMockDb(db);
    return;
  }
  await axiosInstance.delete(`/api/v1/projects/${projectId}/risks/${riskId}`);
};
