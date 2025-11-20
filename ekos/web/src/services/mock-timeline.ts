import type { TimelineItem } from '@/types/api';

export const mockTimelineEvents: TimelineItem[] = [
  {
    date: '2023-10-24T10:00:00Z',
    title: 'Engineering Standup',
    description: 'Sprint progress review, API performance discussion, dashboard demo completed',
    source: 'Zoom Meeting'
  },
  {
    date: '2023-10-23T08:00:00Z',
    title: 'Customer Feedback Analysis Upload',
    description: 'New customer feedback spreadsheet uploaded and processed for Q4 analysis',
    source: 'Google Sheets'
  },
  {
    date: '2023-10-22T14:00:00Z',
    title: 'Product Roadmap Review',
    description: 'Q4 feature prioritization and resource allocation discussed with product team',
    source: 'Zoom Meeting'
  },
  {
    date: '2023-10-20T13:20:00Z',
    title: 'Architecture Diagram Shared',
    description: 'New engineering architecture diagram uploaded to knowledge base',
    source: 'Slack'
  },
  {
    date: '2023-10-15T09:30:00Z',
    title: 'Design System Update',
    description: 'Updated design system documentation with new component patterns',
    source: 'Figma'
  },
  {
    date: '2023-10-01T10:00:00Z',
    title: 'Q3 Financial Report Published',
    description: 'Q3 2023 financial report finalized and published to Google Drive',
    source: 'Google Drive'
  },
  {
    date: '2023-09-15T14:30:00Z',
    title: 'Product Launch',
    description: 'New enterprise features released, driving 35% increase in enterprise sales',
    source: 'Product Roadmap Doc'
  },
  {
    date: '2023-08-10T11:00:00Z',
    title: 'Design System Initial Release',
    description: 'Initial design system documentation published with core components',
    source: 'Figma'
  }
];

