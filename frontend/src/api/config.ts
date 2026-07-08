/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import { MockDatabase } from '../types';

const API_BASE_KEY = 'construction_api_base_url';
const API_MODE_KEY = 'construction_api_mode';
const MOCK_DB_KEY = 'construction_mock_db';

export const API_BASE_URL = 'http://localhost:8000';
const DEFAULT_API_BASE = 'http://localhost:8000';

export function getApiUrl(): string {
  if (!localStorage.getItem(API_BASE_KEY)) {
    localStorage.setItem(API_BASE_KEY, DEFAULT_API_BASE);
  }
  let url = localStorage.getItem(API_BASE_KEY) || DEFAULT_API_BASE;
  if (url.endsWith('/api/v1') || url.endsWith('/api/v1/')) {
    url = url.replace(/\/api\/v1\/?$/, '');
    localStorage.setItem(API_BASE_KEY, url);
  }
  return url;
}

export function setApiUrl(url: string) {
  let cleaned = url.trim();
  if (cleaned.endsWith('/api/v1') || cleaned.endsWith('/api/v1/')) {
    cleaned = cleaned.replace(/\/api\/v1\/?$/, '');
  }
  localStorage.setItem(API_BASE_KEY, cleaned);
}

export function getApiMode(): 'mock' | 'api' {
  if (!localStorage.getItem(API_MODE_KEY)) {
    localStorage.setItem(API_MODE_KEY, 'api');
  }
  return (localStorage.getItem(API_MODE_KEY) as 'mock' | 'api') || 'api';
}

export function setApiMode(mode: 'mock' | 'api') {
  localStorage.setItem(API_MODE_KEY, mode);
}

export function cleanUrl(url: string, _base?: string): string {
  let cleanUrl = url;
  
  // Remove trailing slashes
  if (cleanUrl.length > 1 && cleanUrl.endsWith('/')) {
    cleanUrl = cleanUrl.replace(/\/+$/, '');
  }
  
  // Collapse double slashes (taking care of :// protocol if absolute)
  if (cleanUrl.includes('://')) {
    const protocolIndex = cleanUrl.indexOf('://');
    const protocol = cleanUrl.substring(0, protocolIndex + 3);
    const rest = cleanUrl.substring(protocolIndex + 3).replace(/\/+/g, '/');
    cleanUrl = protocol + rest;
  } else {
    cleanUrl = cleanUrl.replace(/\/+/g, '/');
  }
  
  return cleanUrl;
}

export const apiClient = axios.create({
  baseURL: DEFAULT_API_BASE,
});

apiClient.interceptors.request.use((config) => {
  const currentBaseUrl = getApiUrl() || 'http://localhost:8000';
  config.baseURL = currentBaseUrl.replace(/\/+$/, '');
  if (config.url) {
    config.url = cleanUrl(config.url);
  }
  return config;
});

export const axiosInstance = apiClient;

// Prepopulated high-fidelity demo data
const initialDb: MockDatabase = {
  projects: [
    {
      id: 'p1',
      name: 'Oakwood Commercial Center',
      client_name: 'Oakwood Holdings LLC',
      location: '1240 Oakwood Ave, Seattle, WA',
      start_date: '2026-01-15',
      end_date: '2027-06-30',
      status: 'Active',
      description: 'A 5-story mixed-use commercial office building featuring a retail ground floor, underground parking, and a rooftop green space. Designed for high sustainability with LEED Gold certification goals.',
    },
    {
      id: 'p2',
      name: 'Pacific Heights Residential Tower',
      client_name: 'Pacific Sky Developments',
      location: '88 Ocean Boulevard, San Francisco, CA',
      start_date: '2026-03-01',
      end_date: '2028-12-15',
      status: 'Planning',
      description: 'A high-rise residential building consisting of 120 premium condominiums, a public plaza, wellness center, and advanced seismic retrofitting.',
    },
    {
      id: 'p3',
      name: 'Interstate 5 Highway Extension',
      client_name: 'Department of Transportation',
      location: 'Section 4B (Tacoma to Federal Way)',
      start_date: '2025-08-10',
      end_date: '2026-11-20',
      status: 'On Hold',
      description: 'Widening of key highway segments and structural rehabilitation of two bridge overpasses to ease commercial traffic flow and enhance regional transport safety.',
    },
  ],
  phases: [
    {
      id: 'ph1',
      project_id: 'p1',
      name: 'Site Excavation & Shoring',
      status: 'Completed',
      start_date: '2026-01-20',
      end_date: '2026-03-10',
    },
    {
      id: 'ph2',
      project_id: 'p1',
      name: 'Foundation & Concrete Pouring',
      status: 'In Progress',
      start_date: '2026-03-15',
      end_date: '2026-06-15',
    },
    {
      id: 'ph3',
      project_id: 'p1',
      name: 'Steel Framing & Superstructure',
      status: 'Not Started',
      start_date: '2026-06-20',
      end_date: '2026-10-30',
    },
  ],
  milestones: [
    {
      id: 'm1',
      project_id: 'p1',
      name: 'Permit & Zoning Approval Completed',
      due_date: '2026-01-10',
      completed: true,
    },
    {
      id: 'm2',
      project_id: 'p1',
      name: 'Foundation Subgrade Sign-Off',
      due_date: '2026-04-15',
      completed: true,
    },
    {
      id: 'm3',
      project_id: 'p1',
      name: 'Topping Out Ceremony',
      due_date: '2026-10-15',
      completed: false,
    },
  ],
  budgets: [
    {
      id: 'b1',
      project_id: 'p1',
      category: 'Structural Materials',
      allocated: 4500000,
      spent: 1200000,
      description: 'Concrete mix, reinforcing steel, beams, and pre-cast concrete columns.',
    },
    {
      id: 'b2',
      project_id: 'p1',
      category: 'Labor & Contracting',
      allocated: 3200000,
      spent: 950000,
      description: 'Union labor, specialized ironworkers, carpenters, and excavation contractors.',
    },
    {
      id: 'b3',
      project_id: 'p1',
      category: 'Permits & Consulting',
      allocated: 450000,
      spent: 420000,
      description: 'City engineering approvals, environmental impact reports, and architectural consultants.',
    },
  ],
  risks: [
    {
      id: 'r1',
      project_id: 'p1',
      title: 'Geotechnical Discrepancies',
      description: 'Subsurface soil testing identified wet clay layers deeper than anticipated, requiring reinforced shoring piles.',
      likelihood: 'High',
      impact: 'Medium',
      owner: 'Sarah Connor (Lead Geotech)',
      status: 'Mitigated',
    },
    {
      id: 'r2',
      project_id: 'p1',
      title: 'Steel Supply Chain Delays',
      description: 'Global structural steel shipments are delayed by 3-4 weeks, threatening the start of the framing phase.',
      likelihood: 'Medium',
      impact: 'High',
      owner: 'Michael Chang (Procurement)',
      status: 'Open',
    },
  ],
  issues: [
    {
      id: 'i1',
      project_id: 'p1',
      title: 'Concrete Truck Delivery Delay',
      description: 'Concrete delivery was delayed by 6 hours due to traffic congestion on I-5, postponing the west section pour by half a day.',
      owner: 'Marcus Aurelius (Site Superintendent)',
      status: 'Resolved',
    },
    {
      id: 'i2',
      project_id: 'p1',
      title: 'Utility Grid Mapping Conflict',
      description: 'Uncharted underground utility lines were found near the western excavation boundary, requiring city engineer review.',
      owner: 'Marcus Aurelius (Site Superintendent)',
      status: 'Open',
    },
  ],
  decisions: [
    {
      id: 'd1',
      project_id: 'p1',
      title: 'Switch to Low-Carbon Concrete Mix',
      description: 'Approved the substitution of standard concrete with a low-carbon slag mix to meet green building requirements.',
      decided_by: 'Elena Rostova (Chief Engineer)',
      decision_date: '2026-02-18',
      reference: 'ENG-DEC-2026-004',
    },
  ],
};

export function getMockDb(): MockDatabase {
  const data = localStorage.getItem(MOCK_DB_KEY);
  if (!data) {
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(initialDb));
    return initialDb;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return initialDb;
  }
}

export function saveMockDb(db: MockDatabase) {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db));
}
