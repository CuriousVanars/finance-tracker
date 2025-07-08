import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'income' | 'expense' | 'saving'
          category: string
          amount: number
          date: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'income' | 'expense' | 'saving'
          category: string
          amount: number
          date: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'income' | 'expense' | 'saving'
          category?: string
          amount?: number
          date?: string
          description?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'income' | 'expense' | 'saving'
          budgeted_amount: number
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'income' | 'expense' | 'saving'
          budgeted_amount: number
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'income' | 'expense' | 'saving'
          budgeted_amount?: number
          color?: string | null
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          deadline: string
          category: string
          type: 'saving' | 'expense' | 'income'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          current_amount?: number
          deadline: string
          category: string
          type: 'saving' | 'expense' | 'income'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          deadline?: string
          category?: string
          type?: 'saving' | 'expense' | 'income'
          description?: string | null
          created_at?: string
        }
      }
    }
  }
}
