export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      access_logs: {
        Row: {
          direction: Database["public"]["Enums"]["movement_type"]
          id: string
          staff_id: string | null
          student_id: string | null
          timestamp: string | null
        }
        Insert: {
          direction: Database["public"]["Enums"]["movement_type"]
          id?: string
          staff_id?: string | null
          student_id?: string | null
          timestamp?: string | null
        }
        Update: {
          direction?: Database["public"]["Enums"]["movement_type"]
          id?: string
          staff_id?: string | null
          student_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_logs_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          type: Database["public"]["Enums"]["institution_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          type: Database["public"]["Enums"]["institution_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          type?: Database["public"]["Enums"]["institution_type"]
        }
        Relationships: []
      }
      staff: {
        Row: {
          active: boolean | null
          created_at: string | null
          document_id: string | null
          email: string | null
          full_name: string
          id: string
          institution_id: string | null
          role: Database["public"]["Enums"]["staff_role"]
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          document_id?: string | null
          email?: string | null
          full_name: string
          id?: string
          institution_id?: string | null
          role: Database["public"]["Enums"]["staff_role"]
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          document_id?: string | null
          email?: string | null
          full_name?: string
          id?: string
          institution_id?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Relationships: [
          {
            foreignKeyName: "staff_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          active: boolean | null
          created_at: string | null
          document_id: string | null
          full_name: string
          id: string
          institution_id: string | null
          student_id_card: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          document_id?: string | null
          full_name: string
          id?: string
          institution_id?: string | null
          student_id_card?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          document_id?: string | null
          full_name?: string
          id?: string
          institution_id?: string | null
          student_id_card?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      visitor_badges: {
        Row: {
          badge_number: string
          id: string
          status: Database["public"]["Enums"]["badge_status"] | null
          updated_at: string | null
        }
        Insert: {
          badge_number: string
          id?: string
          status?: Database["public"]["Enums"]["badge_status"] | null
          updated_at?: string | null
        }
        Update: {
          badge_number?: string
          id?: string
          status?: Database["public"]["Enums"]["badge_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      visitors: {
        Row: {
          created_at: string | null
          document_id: string
          full_name: string
          id: string
        }
        Insert: {
          created_at?: string | null
          document_id: string
          full_name: string
          id?: string
        }
        Update: {
          created_at?: string | null
          document_id?: string
          full_name?: string
          id?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          badge_id: string | null
          direction: Database["public"]["Enums"]["movement_type"]
          id: string
          reason: string | null
          timestamp: string | null
          visitor_id: string | null
        }
        Insert: {
          badge_id?: string | null
          direction: Database["public"]["Enums"]["movement_type"]
          id?: string
          reason?: string | null
          timestamp?: string | null
          visitor_id?: string | null
        }
        Update: {
          badge_id?: string | null
          direction?: Database["public"]["Enums"]["movement_type"]
          id?: string
          reason?: string | null
          timestamp?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "visitor_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      badge_status: "available" | "in_use" | "lost"
      institution_type: "college" | "school"
      movement_type: "entry" | "exit"
      staff_role:
        | "teacher"
        | "professor"
        | "administrator"
        | "janitor"
        | "security"
        | "coordinator"
        | "librarian"
        | "receptionist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      badge_status: ["available", "in_use", "lost"],
      institution_type: ["college", "school"],
      movement_type: ["entry", "exit"],
      staff_role: [
        "teacher",
        "professor",
        "administrator",
        "janitor",
        "security",
        "coordinator",
        "librarian",
        "receptionist",
      ],
    },
  },
} as const
