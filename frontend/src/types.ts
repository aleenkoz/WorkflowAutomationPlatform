/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  name: string;
  client_name: string;
  location: string;
  start_date: string;
  end_date: string;
  status: 'Planning' | 'Active' | 'Completed' | 'On Hold';
  description: string;
}

export interface Phase {
  id: string;
  project_id: string;
  name: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  start_date: string;
  end_date: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  due_date: string;
  completed: boolean;
}

export interface Budget {
  id: string;
  project_id: string;
  category: string;
  allocated: number;
  spent: number;
  description: string;
}

export interface Risk {
  id: string;
  project_id: string;
  title: string;
  description: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  owner: string;
  status: 'Open' | 'Mitigated' | 'Closed';
}

export interface Issue {
  id: string;
  project_id: string;
  title: string;
  description: string;
  owner: string;
  status: 'Open' | 'Resolved' | 'Closed';
}

export interface Decision {
  id: string;
  project_id: string;
  title: string;
  description: string;
  decided_by: string;
  decision_date: string;
  reference: string;
}

export interface MockDatabase {
  projects: Project[];
  phases: Phase[];
  milestones: Milestone[];
  budgets: Budget[];
  risks: Risk[];
  issues: Issue[];
  decisions: Decision[];
}
