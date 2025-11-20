import type { QueryResponse, Document, Meeting, ScreenshotMatch } from '@/types/api';

// Realistic mock data generators

export const generateMockQueryResponse = (query: string): QueryResponse => {
  const responses: Record<string, Partial<QueryResponse>> = {
    'q3': {
      answer: "Based on the Q3 financial reports and team meetings, revenue increased by 23% compared to Q2, reaching $4.2M. The growth was primarily driven by enterprise sales (+35%) and the new product launch in September. However, operational costs also rose by 18% due to increased headcount and marketing spend.",
      summary: "Q3 showed strong revenue growth of 23% to $4.2M, led by enterprise sales. Costs increased 18% from hiring and marketing.",
      timeline: [
        {
          date: "2023-09-15T00:00:00Z",
          title: "Product Launch",
          description: "New enterprise features released, driving 35% increase in enterprise sales",
          source: "Product Roadmap Doc"
        },
        {
          date: "2023-10-01T00:00:00Z",
          title: "Q3 Financial Close",
          description: "Revenue reached $4.2M, 23% growth over Q2",
          source: "Financial Report Q3 2023"
        }
      ],
      citations: [
        {
          doc_id: "doc_q3_2023",
          chunk_id: "chunk_001",
          text: "Q3 revenue totaled $4.2M, representing a 23% increase from Q2. Enterprise segment grew 35% following the September product launch...",
          score: 0.92,
          metadata: { source: "Google Drive", title: "Q3 Financial Report" }
        },
        {
          doc_id: "doc_team_meeting_092023",
          chunk_id: "chunk_045",
          text: "Sarah mentioned that operational costs rose 18% this quarter, primarily from the 12 new hires in engineering and increased marketing spend...",
          score: 0.87,
          metadata: { source: "Zoom", title: "Leadership Team Meeting - Sept 2023" }
        }
      ],
      actions: [
        {
          action: "create_report",
          title: "Generate Q3 Summary Deck",
          description: "Create executive summary presentation with key metrics",
          priority: "high"
        }
      ]
    },
    'login': {
      answer: "The login flow consists of three main screens: the main login page with email/password fields, a forgot password screen for account recovery, and a two-factor authentication screen for enhanced security. The UI uses a clean, minimalist design with the company logo at the top and a 'Create Account' link at the bottom.",
      summary: "Login flow has 3 screens: main login, password recovery, and 2FA. Clean minimalist design.",
      citations: [
        {
          doc_id: "doc_design_system",
          chunk_id: "chunk_login_001",
          text: "Login screen mockup shows email and password input fields, with 'Forgot Password' link below. Company logo centered at top, 'Create Account' CTA at bottom...",
          score: 0.95,
          metadata: { source: "Figma", title: "Design System - Auth Flows" }
        }
      ]
    },
    'meeting': {
      answer: "The last engineering standup on October 24th covered sprint progress, with the team completing 8 out of 10 planned stories. Alex raised concerns about API performance issues affecting the mobile app. Sarah committed to investigating the database query optimization. Mike demoed the new dashboard feature.",
      summary: "Engineering standup: 8/10 stories done, API performance issues raised, dashboard demo completed.",
      timeline: [
        {
          date: "2023-10-24T10:00:00Z",
          title: "Engineering Standup",
          description: "Sprint review, performance discussion, dashboard demo",
          source: "Zoom Meeting"
        }
      ],
      citations: [
        {
          doc_id: "meeting_102423",
          chunk_id: "transcript_001",
          text: "Alex: We're seeing response times over 2 seconds on the mobile API. Sarah: I'll look into the database queries this afternoon...",
          score: 0.89,
          metadata: { source: "Zoom", title: "Engineering Standup - Oct 24" }
        }
      ],
      actions: [
        {
          action: "create_jira",
          title: "Investigate API Performance",
          description: "Database query optimization for mobile endpoints",
          priority: "high"
        }
      ]
    }
  };

  // Find matching response or use default
  const matchKey = Object.keys(responses).find(key =>
    query.toLowerCase().includes(key.toLowerCase())
  );

  const baseResponse = matchKey ? responses[matchKey] : {
    answer: `Based on your query "${query}", I found several relevant documents in the knowledge base. The information suggests this topic has been discussed in recent team meetings and documented in various sources.`,
    summary: "Multiple relevant sources found across documents and meetings.",
    citations: [
      {
        doc_id: "doc_general_001",
        chunk_id: "chunk_001",
        text: `Information related to "${query}" can be found in multiple documents across the organization...`,
        score: 0.75,
        metadata: { source: "Google Drive", title: "General Documentation" }
      }
    ]
  };

  return {
    answer: baseResponse.answer || "",
    summary: baseResponse.summary || "",
    timeline: baseResponse.timeline || [],
    citations: baseResponse.citations || [],
    actions: baseResponse.actions || [],
    query_id: `query_${Date.now()}`,
    processed_at: new Date().toISOString()
  };
};

export const mockDocuments: Document[] = [
  {
    id: 'doc_001',
    title: 'Q3 2023 Financial Report',
    source: 'Google Drive',
    type: 'pdf',
    status: 'ready',
    created_at: '2023-10-01T10:00:00Z',
    updated_at: '2023-10-01T10:00:00Z',
    size: 2458000,
    metadata: { author: 'Finance Team', category: 'Financial' }
  },
  {
    id: 'doc_002',
    title: 'Product Roadmap 2024',
    source: 'Confluence',
    type: 'url',
    status: 'ready',
    created_at: '2023-09-15T14:30:00Z',
    updated_at: '2023-10-20T09:15:00Z',
    metadata: { author: 'Product Team', category: 'Planning' }
  },
  {
    id: 'doc_003',
    title: 'Design System Documentation',
    source: 'Figma',
    type: 'url',
    status: 'ready',
    created_at: '2023-08-10T11:00:00Z',
    updated_at: '2023-10-22T16:45:00Z',
    metadata: { author: 'Design Team', category: 'Design' }
  },
  {
    id: 'doc_004',
    title: 'Customer Feedback Analysis',
    source: 'Google Sheets',
    type: 'xlsx',
    status: 'processing',
    created_at: '2023-10-23T08:00:00Z',
    updated_at: '2023-10-23T08:00:00Z',
    size: 1024000,
    metadata: { author: 'Customer Success', category: 'Analytics' }
  },
  {
    id: 'doc_005',
    title: 'Engineering Architecture Diagram',
    source: 'Slack',
    type: 'image',
    status: 'ready',
    created_at: '2023-10-20T13:20:00Z',
    updated_at: '2023-10-20T13:20:00Z',
    size: 512000,
    metadata: { author: 'Engineering', category: 'Technical' }
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: 'meeting_001',
    title: 'Engineering Standup - Oct 24',
    date: '2023-10-24T10:00:00Z',
    duration: 30,
    attendees: ['Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emily Davis'],
    summary: 'Sprint progress review, API performance discussion, dashboard demo',
    action_items: [
      {
        action: 'investigate',
        title: 'Investigate API Performance',
        description: 'Database query optimization for mobile endpoints',
        priority: 'high'
      },
      {
        action: 'review',
        title: 'Review Dashboard PR',
        description: 'Code review for new analytics dashboard',
        priority: 'medium'
      }
    ],
    transcript: "Alex: Good morning team. Let's start with sprint progress.\n\nSarah: We completed 8 out of 10 stories. The remaining two are blocked on API performance issues.\n\nAlex: Can you elaborate on the performance issues?\n\nSarah: We're seeing response times over 2 seconds on the mobile API, particularly for the user dashboard endpoint.\n\nMike: I noticed that too during testing. It's affecting the mobile app experience.\n\nSarah: I'll investigate the database queries this afternoon. Might need to add some indexes.\n\nAlex: Great. Mike, can you demo the new dashboard?\n\nMike: Sure! *shares screen* Here's the new analytics dashboard with real-time metrics..."
  },
  {
    id: 'meeting_002',
    title: 'Product Roadmap Review - Oct 22',
    date: '2023-10-22T14:00:00Z',
    duration: 60,
    attendees: ['Jennifer Lee', 'Alex Chen', 'David Park', 'Lisa Wang'],
    summary: 'Q4 feature prioritization and resource allocation',
    action_items: [
      {
        action: 'create_doc',
        title: 'Draft Q4 Feature Specs',
        description: 'Detailed specifications for top 3 Q4 features',
        priority: 'high'
      }
    ]
  },
  {
    id: 'meeting_003',
    title: 'Customer Success Sync - Oct 23',
    date: '2023-10-23T11:00:00Z',
    duration: 45,
    attendees: ['Rachel Green', 'Tom Anderson', 'Nina Patel'],
    summary: 'Customer feedback review and support ticket analysis',
    action_items: [
      {
        action: 'follow_up',
        title: 'Follow up with Enterprise Customers',
        description: 'Schedule calls with top 5 enterprise accounts',
        priority: 'medium'
      }
    ]
  }
];

export const mockScreenshotMatches: ScreenshotMatch[] = [
  {
    doc_id: 'doc_design_system',
    chunk_id: 'chunk_login_001',
    similarity_score: 0.95,
    text: 'Login screen mockup with email/password fields, company logo, and create account link',
    metadata: { source: 'Figma', title: 'Design System - Auth Flows', page: 'Login Flow' }
  },
  {
    doc_id: 'doc_ui_components',
    chunk_id: 'chunk_form_003',
    similarity_score: 0.87,
    text: 'Form component library showing input fields with validation states',
    metadata: { source: 'Figma', title: 'UI Component Library', page: 'Forms' }
  },
  {
    doc_id: 'doc_mobile_app',
    chunk_id: 'chunk_auth_002',
    similarity_score: 0.82,
    text: 'Mobile authentication screens with biometric login option',
    metadata: { source: 'Figma', title: 'Mobile App Designs', page: 'Authentication' }
  }
];
