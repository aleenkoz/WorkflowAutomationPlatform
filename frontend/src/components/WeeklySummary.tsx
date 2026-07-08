/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import WeeklyMeetingSummary from './WeeklyMeetingSummary';

interface WeeklySummaryProps {
  projectId: string | number;
}

export default function WeeklySummary({ projectId }: WeeklySummaryProps) {
  return <WeeklyMeetingSummary projectId={projectId} />;
}
