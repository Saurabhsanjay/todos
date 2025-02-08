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
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          is_completed: boolean
          due_date: string | null
          priority: 'low' | 'medium' | 'high'
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          is_completed?: boolean
          due_date?: string | null
          priority?: 'low' | 'medium' | 'high'
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          is_completed?: boolean
          due_date?: string | null
          priority?: 'low' | 'medium' | 'high'
          user_id?: string
        }
      }
    }
  }
}