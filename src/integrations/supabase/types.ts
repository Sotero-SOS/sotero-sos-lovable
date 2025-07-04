export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          requires_password_reset: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          requires_password_reset?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          requires_password_reset?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      sos_calls: {
        Row: {
          completion_time: string | null
          created_at: string | null
          description: string | null
          diagnostico_compactador: string[] | null
          diagnostico_eletrica: string[] | null
          diagnostico_mecanico: string[] | null
          diagnostico_suspensao: string[] | null
          driver_name: string
          estimated_time: number | null
          id: string
          location: string
          outros_problemas: string | null
          pneu_furado: boolean | null
          pneu_posicoes: string[] | null
          problem_type: string | null
          request_time: string | null
          status: Database["public"]["Enums"]["sos_status"] | null
          updated_at: string | null
          user_id: string | null
          vehicle_id: string | null
          vehicle_plate: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          completion_time?: string | null
          created_at?: string | null
          description?: string | null
          diagnostico_compactador?: string[] | null
          diagnostico_eletrica?: string[] | null
          diagnostico_mecanico?: string[] | null
          diagnostico_suspensao?: string[] | null
          driver_name: string
          estimated_time?: number | null
          id?: string
          location: string
          outros_problemas?: string | null
          pneu_furado?: boolean | null
          pneu_posicoes?: string[] | null
          problem_type?: string | null
          request_time?: string | null
          status?: Database["public"]["Enums"]["sos_status"] | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string | null
          vehicle_plate: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          completion_time?: string | null
          created_at?: string | null
          description?: string | null
          diagnostico_compactador?: string[] | null
          diagnostico_eletrica?: string[] | null
          diagnostico_mecanico?: string[] | null
          diagnostico_suspensao?: string[] | null
          driver_name?: string
          estimated_time?: number | null
          id?: string
          location?: string
          outros_problemas?: string | null
          pneu_furado?: boolean | null
          pneu_posicoes?: string[] | null
          problem_type?: string | null
          request_time?: string | null
          status?: Database["public"]["Enums"]["sos_status"] | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string | null
          vehicle_plate?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: [
          {
            foreignKeyName: "sos_calls_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string | null
          driver_name: string
          id: string
          last_activity: string | null
          location: string | null
          maintenance_type: string | null
          plate: string
          status: string | null
          type: Database["public"]["Enums"]["vehicle_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          driver_name: string
          id?: string
          last_activity?: string | null
          location?: string | null
          maintenance_type?: string | null
          plate: string
          status?: string | null
          type: Database["public"]["Enums"]["vehicle_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          driver_name?: string
          id?: string
          last_activity?: string | null
          location?: string | null
          maintenance_type?: string | null
          plate?: string
          status?: string | null
          type?: Database["public"]["Enums"]["vehicle_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_with_password: {
        Args: {
          user_email: string
          user_password: string
          user_full_name: string
          user_phone?: string
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Returns: Json
      }
    }
    Enums: {
      sos_status: "waiting" | "in-progress" | "completed" | "overdue"
      user_role: "admin" | "trafego" | "mecanico"
      vehicle_type: "Truck" | "Super Toco" | "Agilix" | "Triciclo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      sos_status: ["waiting", "in-progress", "completed", "overdue"],
      user_role: ["admin", "trafego", "mecanico"],
      vehicle_type: ["Truck", "Super Toco", "Agilix", "Triciclo"],
    },
  },
} as const
