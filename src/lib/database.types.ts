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
      receipts: {
        Row: {
          id: string
          data_compra: string
          mercado: string
          items: Json
          total: number
          created_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          data_compra: string
          mercado: string
          items: Json
          total: number
          created_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          data_compra?: string
          mercado?: string
          items?: Json
          total?: number
          created_at?: string
          user_id?: string | null
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