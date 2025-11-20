import apiClient from './api-client';
import type {
  QueryRequest,
  QueryResponse,
  IngestUrlRequest,
  IngestResponse,
  ScreenshotMatchRequest,
  ScreenshotMatchResponse,
  Document,
  Meeting
} from '@/types/api';
import {
  generateMockQueryResponse,
  mockDocuments,
  mockMeetings,
  mockScreenshotMatches
} from './mock-data';

// Delay helper for realistic mock responses
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const queryAPI = {
  async search(request: QueryRequest): Promise<QueryResponse> {
    // Always try to call the backend first (unless explicitly in mock mode)
    if (!apiClient.isMockMode()) {
      try {
        // Call the backend /query endpoint
        const response = await apiClient.post<QueryResponse>('/query', {
          query: request.query,
          tenant_id: request.tenant_id || 'default',
          filters: request.filters || {},
          top_k: request.top_k || 5,
          include_citations: request.include_citations !== false,
        });
        return response;
      } catch (error: any) {
        console.error('Query API error:', error);
        // Fallback to mock if backend is not available (for prototype)
        if (error.code === 'ERR_NETWORK' || error.response?.status >= 500 || error.response?.status === 404) {
          console.warn('Backend unavailable, falling back to mock response');
          await delay(800);
          return generateMockQueryResponse(request.query);
        }
        // Re-throw other errors (like validation errors)
        throw error;
      }
    }
    
    // Use mock mode if explicitly enabled
    await delay(800 + Math.random() * 400); // 800-1200ms delay
    return generateMockQueryResponse(request.query);
  },
};

export const ingestAPI = {
  async ingestUrl(request: IngestUrlRequest): Promise<IngestResponse> {
    if (apiClient.isMockMode()) {
      await delay(1000);
      return {
        doc_id: `doc_${Date.now()}`,
        status: 'processing',
        message: 'Document ingestion started successfully'
      };
    }
    return apiClient.post<IngestResponse>('/ingest/url', request);
  },

  async uploadFile(file: File, source: string, metadata?: Record<string, any>): Promise<IngestResponse> {
    if (apiClient.isMockMode()) {
      await delay(1500);
      return {
        doc_id: `doc_${Date.now()}`,
        status: 'processing',
        message: `File "${file.name}" uploaded successfully`
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', source);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    return apiClient.post<IngestResponse>('/ingest/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export const screenshotAPI = {
  async matchScreenshot(request: ScreenshotMatchRequest): Promise<ScreenshotMatchResponse> {
    if (apiClient.isMockMode()) {
      await delay(1200);
      return {
        matches: mockScreenshotMatches,
        query_id: `screenshot_${Date.now()}`
      };
    }
    return apiClient.post<ScreenshotMatchResponse>('/screenshot-match', request);
  },
};

export const documentsAPI = {
  async list(): Promise<Document[]> {
    if (apiClient.isMockMode()) {
      await delay(300);
      return mockDocuments;
    }
    // TODO: Implement real endpoint when available
    return apiClient.get<Document[]>('/documents');
  },

  async get(id: string): Promise<Document> {
    if (apiClient.isMockMode()) {
      await delay(200);
      const doc = mockDocuments.find(d => d.id === id);
      if (!doc) throw new Error('Document not found');
      return doc;
    }
    return apiClient.get<Document>(`/documents/${id}`);
  },
};

export const meetingsAPI = {
  async list(): Promise<Meeting[]> {
    if (apiClient.isMockMode()) {
      await delay(300);
      return mockMeetings;
    }
    // TODO: Implement real endpoint when available
    return apiClient.get<Meeting[]>('/meetings');
  },

  async get(id: string): Promise<Meeting> {
    if (apiClient.isMockMode()) {
      await delay(200);
      const meeting = mockMeetings.find(m => m.id === id);
      if (!meeting) throw new Error('Meeting not found');
      return meeting;
    }
    return apiClient.get<Meeting>(`/meetings/${id}`);
  },
};

export const automationAPI = {
  async createJiraTicket(data: {
    project: string;
    summary: string;
    description: string;
    issue_type?: string;
  }): Promise<{ ticket_id: string; url: string }> {
    if (apiClient.isMockMode()) {
      await delay(800);
      return {
        ticket_id: `EKOS-${Math.floor(Math.random() * 1000)}`,
        url: `https://jira.example.com/browse/EKOS-${Math.floor(Math.random() * 1000)}`
      };
    }
    return apiClient.post('/automation/create-jira', data);
  },
};
