// API Types matching backend models

export interface QueryRequest {
    query: string;
    tenant_id?: string;
    filters?: Record<string, any>;
    top_k?: number;
    include_citations?: boolean;
}

export interface Citation {
    doc_id: string;
    chunk_id: string;
    text: string;
    score: number;
    metadata?: Record<string, any>;
}

export interface TimelineItem {
    date: string | null;
    title: string;
    description: string;
    source?: string;
}

export interface ActionItem {
    action: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    metadata?: Record<string, any>;
}

export interface QueryResponse {
    answer: string;
    summary: string;
    timeline: TimelineItem[];
    citations: Citation[];
    actions: ActionItem[];
    query_id: string;
    processed_at: string;
}

export interface IngestUrlRequest {
    url: string;
    source: string;
    tenant_id?: string;
    metadata?: Record<string, any>;
}

export interface IngestResponse {
    doc_id: string;
    status: string;
    message: string;
}

export interface ScreenshotMatchRequest {
    image_base64?: string;
}

export interface ScreenshotMatch {
    doc_id: string;
    chunk_id: string;
    similarity_score: number;
    text: string;
    metadata?: Record<string, any>;
}

export interface ScreenshotMatchResponse {
    matches: ScreenshotMatch[];
    query_id: string;
}

export interface Document {
    id: string;
    title: string;
    source: string;
    type: 'pdf' | 'docx' | 'xlsx' | 'image' | 'video' | 'url';
    status: 'processing' | 'ready' | 'failed';
    created_at: string;
    updated_at: string;
    metadata?: Record<string, any>;
    size?: number;
    url?: string;
}

export interface Meeting {
    id: string;
    title: string;
    date: string;
    duration: number;
    attendees: string[];
    transcript?: string;
    action_items: ActionItem[];
    summary?: string;
}
