import { supabase } from './supabase';
import type { Database } from './supabase-types';

type Tables = Database['public']['Tables'];

// Profile helpers
export const profileHelpers = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Tables['profiles']['Update']) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// Document helpers
export const documentHelpers = {
  async getDocuments(userId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getDocument(id: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createDocument(document: Tables['documents']['Insert']) {
    const { data, error } = await supabase
      .from('documents')
      .insert(document)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateDocument(id: string, updates: Tables['documents']['Update']) {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteDocument(id: string) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Screenshot helpers
export const screenshotHelpers = {
  async getScreenshots(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('screenshots')
      .select('*')
      .eq('user_id', userId)
      .order('taken_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async searchScreenshots(userId: string, query: string) {
    const { data, error } = await supabase
      .from('screenshots')
      .select('*')
      .eq('user_id', userId)
      .textSearch('ocr_text', query)
      .order('taken_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};

// Meeting helpers
export const meetingHelpers = {
  async getMeetings(userId: string) {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getMeeting(id: string) {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
};

// Timeline helpers
export const timelineHelpers = {
  async getTimelineEvents(userId: string, startDate?: Date, endDate?: Date) {
    let query = supabase
      .from('timeline_events')
      .select('*')
      .eq('user_id', userId);
    
    if (startDate) {
      query = query.gte('timestamp', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('timestamp', endDate.toISOString());
    }
    
    const { data, error } = await query.order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};

// Knowledge Graph helpers
export const graphHelpers = {
  async getNodes(userId: string) {
    const { data, error } = await supabase
      .from('nodes')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async getEdges(userId: string) {
    const { data, error } = await supabase
      .from('edges')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async getGraph(userId: string) {
    const [nodes, edges] = await Promise.all([
      this.getNodes(userId),
      this.getEdges(userId),
    ]);
    
    return { nodes, edges };
  },
};
