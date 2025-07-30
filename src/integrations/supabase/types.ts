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
      user: {
        Row: {
          id: number
          username: string
          hashed_password: string
          is_admin: boolean
          avatar_url: string | null
          full_name: string | null
          phone: string | null
          requires_password_reset: boolean | null
          role: string | null
        }
        Insert: {
          id?: number
          username: string
          hashed_password: string
          is_admin?: boolean
          avatar_url?: string | null
          full_name?: string | null
          phone?: string | null
          requires_password_reset?: boolean | null
          role?: string | null
        }
        Update: {
          id?: number
          username?: string
          hashed_password?: string
          is_admin?: boolean
          avatar_url?: string | null
          full_name?: string | null
          phone?: string | null
          requires_password_reset?: boolean | null
          role?: string | null
        }
        Relationships: []
      }
      setor: {
        Row: {
          id: number
          nome_setor: string
          turno: string | null
        }
        Insert: {
          id?: number
          nome_setor: string
          turno?: string | null
        }
        Update: {
          id?: number
          nome_setor?: string
          turno?: string | null
        }
        Relationships: []
      }
      veiculo: {
        Row: {
          cod_veiculo: number
          categoria: string | null
          situacao: string | null
          driver_name: string | null
          last_activity: string | null
          location: string | null
          maintenance_type: string | null
          type: string | null
        }
        Insert: {
          cod_veiculo?: number
          categoria?: string | null
          situacao?: string | null
          driver_name?: string | null
          last_activity?: string | null
          location?: string | null
          maintenance_type?: string | null
          type?: string | null
        }
        Update: {
          cod_veiculo?: number
          categoria?: string | null
          situacao?: string | null
          driver_name?: string | null
          last_activity?: string | null
          location?: string | null
          maintenance_type?: string | null
          type?: string | null
        }
        Relationships: []
      }
      motorista: {
        Row: {
          matricula: number
          nome: string
          setor_id: number | null
          cod_veiculo: number | null
        }
        Insert: {
          matricula?: number
          nome: string
          setor_id?: number | null
          cod_veiculo?: number | null
        }
        Update: {
          matricula?: number
          nome?: string
          setor_id?: number | null
          cod_veiculo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "motorista_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motorista_cod_veiculo_fkey"
            columns: ["cod_veiculo"]
            isOneToOne: false
            referencedRelation: "veiculo"
            referencedColumns: ["cod_veiculo"]
          }
        ]
      }
      motivo: {
        Row: {
          cod_motivo: number
          descricao: string
          tempo_previsto: string | null
        }
        Insert: {
          cod_motivo?: number
          descricao: string
          tempo_previsto?: string | null
        }
        Update: {
          cod_motivo?: number
          descricao?: string
          tempo_previsto?: string | null
        }
        Relationships: []
      }
      atendimento: {
        Row: {
          nr_atendimento: number
          auxiliar_de_trafego: string | null
          fiscal: string | null
          data: string | null
          inicio_sos: string | null
          chegada_na_garagem: string | null
          final_sos: string | null
          status: string | null
          local: string | null
          matricula_motorista: number
          cod_motivo: number
          diagnostico_compactador: string[] | null
          diagnostico_eletrica: string[] | null
          diagnostico_mecanico: string[] | null
          diagnostico_suspensao: string[] | null
          outros_problemas: string | null
          pneu_furado: boolean | null
          pneu_posicoes: string[] | null
          problem_type: string | null
          user_id: string | null
          vehicle_id: number | null
          vehicle_plate: string | null
          vehicle_type: string | null
        }
        Insert: {
          nr_atendimento?: number
          auxiliar_de_trafego?: string | null
          fiscal?: string | null
          data?: string | null
          inicio_sos?: string | null
          chegada_na_garagem?: string | null
          final_sos?: string | null
          status?: string | null
          local?: string | null
          matricula_motorista: number
          cod_motivo: number
          diagnostico_compactador?: string[] | null
          diagnostico_eletrica?: string[] | null
          diagnostico_mecanico?: string[] | null
          diagnostico_suspensao?: string[] | null
          outros_problemas?: string | null
          pneu_furado?: boolean | null
          pneu_posicoes?: string[] | null
          problem_type?: string | null
          user_id?: string | null
          vehicle_id?: number | null
          vehicle_plate?: string | null
          vehicle_type?: string | null
        }
        Update: {
          nr_atendimento?: number
          auxiliar_de_trafego?: string | null
          fiscal?: string | null
          data?: string | null
          inicio_sos?: string | null
          chegada_na_garagem?: string | null
          final_sos?: string | null
          status?: string | null
          local?: string | null
          matricula_motorista?: number
          cod_motivo?: number
          diagnostico_compactador?: string[] | null
          diagnostico_eletrica?: string[] | null
          diagnostico_mecanico?: string[] | null
          diagnostico_suspensao?: string[] | null
          outros_problemas?: string | null
          pneu_furado?: boolean | null
          pneu_posicoes?: string[] | null
          problem_type?: string | null
          user_id?: string | null
          vehicle_id?: number | null
          vehicle_plate?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "atendimento_matricula_motorista_fkey"
            columns: ["matricula_motorista"]
            isOneToOne: false
            referencedRelation: "motorista"
            referencedColumns: ["matricula"]
          },
          {
            foreignKeyName: "atendimento_cod_motivo_fkey"
            columns: ["cod_motivo"]
            isOneToOne: false
            referencedRelation: "motivo"
            referencedColumns: ["cod_motivo"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never