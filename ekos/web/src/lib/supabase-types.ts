export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    updated_at: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    updated_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    updated_at?: string | null
                    created_at?: string
                }
            }
            documents: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    content: string | null
                    file_url: string | null
                    file_type: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    content?: string | null
                    file_url?: string | null
                    file_type?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    content?: string | null
                    file_url?: string | null
                    file_type?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            screenshots: {
                Row: {
                    id: string
                    user_id: string
                    image_url: string
                    ocr_text: string | null
                    app_name: string | null
                    window_title: string | null
                    taken_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    image_url: string
                    ocr_text?: string | null
                    app_name?: string | null
                    window_title?: string | null
                    taken_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    image_url?: string
                    ocr_text?: string | null
                    app_name?: string | null
                    window_title?: string | null
                    taken_at?: string
                }
            }
            meetings: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    transcript: string | null
                    summary: string | null
                    recording_url: string | null
                    started_at: string
                    ended_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    transcript?: string | null
                    summary?: string | null
                    recording_url?: string | null
                    started_at: string
                    ended_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    transcript?: string | null
                    summary?: string | null
                    recording_url?: string | null
                    started_at?: string
                    ended_at?: string | null
                    created_at?: string
                }
            }
            timeline_events: {
                Row: {
                    id: string
                    user_id: string
                    source_type: string
                    source_id: string | null
                    description: string | null
                    timestamp: string
                    metadata: Json | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    source_type: string
                    source_id?: string | null
                    description?: string | null
                    timestamp: string
                    metadata?: Json | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    source_type?: string
                    source_id?: string | null
                    description?: string | null
                    timestamp?: string
                    metadata?: Json | null
                }
            }
            nodes: {
                Row: {
                    id: string
                    user_id: string
                    label: string
                    type: string
                    properties: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    label: string
                    type: string
                    properties?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    label?: string
                    type?: string
                    properties?: Json | null
                    created_at?: string
                }
            }
            edges: {
                Row: {
                    id: string
                    user_id: string
                    source_id: string | null
                    target_id: string | null
                    relationship: string
                    properties: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    source_id?: string | null
                    target_id?: string | null
                    relationship: string
                    properties?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    source_id?: string | null
                    target_id?: string | null
                    relationship?: string
                    properties?: Json | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
