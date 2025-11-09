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
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company: string | null
          plan_tier: string
          stripe_customer_id: string | null
          usage_count: number
          usage_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company?: string | null
          plan_tier?: string
          stripe_customer_id?: string | null
          usage_count?: number
          usage_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company?: string | null
          plan_tier?: string
          stripe_customer_id?: string | null
          usage_count?: number
          usage_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      content_sources: {
        Row: {
          id: string
          user_id: string
          type: string
          url: string | null
          title: string | null
          transcript: string | null
          metadata: Json | null
          word_count: number | null
          duration_minutes: number | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          url?: string | null
          title?: string | null
          transcript?: string | null
          metadata?: Json | null
          word_count?: number | null
          duration_minutes?: number | null
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          url?: string | null
          title?: string | null
          transcript?: string | null
          metadata?: Json | null
          word_count?: number | null
          duration_minutes?: number | null
          processed_at?: string | null
          created_at?: string
        }
      }
      content_analyses: {
        Row: {
          id: string
          content_source_id: string
          main_topic: string | null
          sub_topics: string[] | null
          key_takeaways: string[] | null
          quotes: string[] | null
          target_audience: string | null
          pain_points: string[] | null
          suggested_ctas: string[] | null
          sentiment: string | null
          difficulty: string | null
          full_analysis: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          content_source_id: string
          main_topic?: string | null
          sub_topics?: string[] | null
          key_takeaways?: string[] | null
          quotes?: string[] | null
          target_audience?: string | null
          pain_points?: string[] | null
          suggested_ctas?: string[] | null
          sentiment?: string | null
          difficulty?: string | null
          full_analysis?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          content_source_id?: string
          main_topic?: string | null
          sub_topics?: string[] | null
          key_takeaways?: string[] | null
          quotes?: string[] | null
          target_audience?: string | null
          pain_points?: string[] | null
          suggested_ctas?: string[] | null
          sentiment?: string | null
          difficulty?: string | null
          full_analysis?: Json | null
          created_at?: string
        }
      }
      newsletters: {
        Row: {
          id: string
          user_id: string
          content_source_id: string | null
          analysis_id: string | null
          title: string | null
          subject_lines: Json | null
          selected_subject_line: string | null
          content_markdown: string | null
          content_html: string | null
          tone: string | null
          length: string | null
          structure: string | null
          word_count: number | null
          reading_time_minutes: number | null
          status: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_source_id?: string | null
          analysis_id?: string | null
          title?: string | null
          subject_lines?: Json | null
          selected_subject_line?: string | null
          content_markdown?: string | null
          content_html?: string | null
          tone?: string | null
          length?: string | null
          structure?: string | null
          word_count?: number | null
          reading_time_minutes?: number | null
          status?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_source_id?: string | null
          analysis_id?: string | null
          title?: string | null
          subject_lines?: Json | null
          selected_subject_line?: string | null
          content_markdown?: string | null
          content_html?: string | null
          tone?: string | null
          length?: string | null
          structure?: string | null
          word_count?: number | null
          reading_time_minutes?: number | null
          status?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      export_logs: {
        Row: {
          id: string
          newsletter_id: string
          user_id: string
          export_type: string
          exported_at: string
        }
        Insert: {
          id?: string
          newsletter_id: string
          user_id: string
          export_type: string
          exported_at?: string
        }
        Update: {
          id?: string
          newsletter_id?: string
          user_id?: string
          export_type?: string
          exported_at?: string
        }
      }
      test_emails: {
        Row: {
          id: string
          newsletter_id: string
          user_id: string
          recipient_email: string
          subject_line: string | null
          sent_at: string
        }
        Insert: {
          id?: string
          newsletter_id: string
          user_id: string
          recipient_email: string
          subject_line?: string | null
          sent_at?: string
        }
        Update: {
          id?: string
          newsletter_id?: string
          user_id?: string
          recipient_email?: string
          subject_line?: string | null
          sent_at?: string
        }
      }
      usage_events: {
        Row: {
          id: string
          user_id: string
          event_type: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: string
          metadata?: Json | null
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
