export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      cadastro: {
        Row: {
          bacia: string | null
          bairro: string | null
          categoria_1: string | null
          categoria_2: string | null
          cep: string | null
          cnpj_ou_cpf: string | null
          codigo: string | null
          ddd: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          gerencia: string | null
          id: string
          infraestrutura: string | null
          loja: string | null
          municipio: string | null
          nome_fantasia: string | null
          razao_social: string | null
          situacao_cadastral: string | null
          telefone_1: string | null
          telefone_2: string | null
          telefone_3: string | null
          tipo_usuario: string | null
        }
        Insert: {
          bacia?: string | null
          bairro?: string | null
          categoria_1?: string | null
          categoria_2?: string | null
          cep?: string | null
          cnpj_ou_cpf?: string | null
          codigo?: string | null
          ddd?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          gerencia?: string | null
          id: string
          infraestrutura?: string | null
          loja?: string | null
          municipio?: string | null
          nome_fantasia?: string | null
          razao_social?: string | null
          situacao_cadastral?: string | null
          telefone_1?: string | null
          telefone_2?: string | null
          telefone_3?: string | null
          tipo_usuario?: string | null
        }
        Update: {
          bacia?: string | null
          bairro?: string | null
          categoria_1?: string | null
          categoria_2?: string | null
          cep?: string | null
          cnpj_ou_cpf?: string | null
          codigo?: string | null
          ddd?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          gerencia?: string | null
          id?: string
          infraestrutura?: string | null
          loja?: string | null
          municipio?: string | null
          nome_fantasia?: string | null
          razao_social?: string | null
          situacao_cadastral?: string | null
          telefone_1?: string | null
          telefone_2?: string | null
          telefone_3?: string | null
          tipo_usuario?: string | null
        }
        Relationships: []
      }
      dim_perfis: {
        Row: {
          id: number
          nome: string | null
        }
        Insert: {
          id?: number
          nome?: string | null
        }
        Update: {
          id?: number
          nome?: string | null
        }
        Relationships: []
      }
      dim_usuarios: {
        Row: {
          created_at: string | null
          email: string | null
          nome: string | null
          perfil_id: number | null
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          nome?: string | null
          perfil_id?: number | null
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          nome?: string | null
          perfil_id?: number | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dim_usuarios_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "dim_perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      faturamento_fato: {
        Row: {
          baixa: string | null
          bx_parc: string | null
          codigo: string | null
          competencia: string | null
          consumo: number | null
          dt_competencia: string | null
          emissao: string | null
          fatura: string
          faturado: number | null
          id: string | null
          id_fatura: number
          parcela: string | null
          ref_consulta: string | null
          saldo: number | null
          tarifa: number | null
          tp_nota: string | null
          val_devol: number | null
          vencimento: string | null
        }
        Insert: {
          baixa?: string | null
          bx_parc?: string | null
          codigo?: string | null
          competencia?: string | null
          consumo?: number | null
          dt_competencia?: string | null
          emissao?: string | null
          fatura: string
          faturado?: number | null
          id?: string | null
          id_fatura?: never
          parcela?: string | null
          ref_consulta?: string | null
          saldo?: number | null
          tarifa?: number | null
          tp_nota?: string | null
          val_devol?: number | null
          vencimento?: string | null
        }
        Update: {
          baixa?: string | null
          bx_parc?: string | null
          codigo?: string | null
          competencia?: string | null
          consumo?: number | null
          dt_competencia?: string | null
          emissao?: string | null
          fatura?: string
          faturado?: number | null
          id?: string | null
          id_fatura?: never
          parcela?: string | null
          ref_consulta?: string | null
          saldo?: number | null
          tarifa?: number | null
          tp_nota?: string | null
          val_devol?: number | null
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faturamento_fato_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "cadastro"
            referencedColumns: ["id"]
          },
        ]
      }
      indicador: {
        Row: {
          ano_referencia: number
          calculo_indicador: string | null
          created_at: string
          descricao: string | null
          gerencia: string
          id: string
          meta: number | null
          meta_percentual: number | null
          nome: string
          resultado: number | null
          updated_at: string
        }
        Insert: {
          ano_referencia: number
          calculo_indicador?: string | null
          created_at?: string
          descricao?: string | null
          gerencia: string
          id?: string
          meta?: number | null
          meta_percentual?: number | null
          nome: string
          resultado?: number | null
          updated_at?: string
        }
        Update: {
          ano_referencia?: number
          calculo_indicador?: string | null
          created_at?: string
          descricao?: string | null
          gerencia?: string
          id?: string
          meta?: number | null
          meta_percentual?: number | null
          nome?: string
          resultado?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      medicao: {
        Row: {
          cod_protheus: string | null
          consumo_atual: number
          criado_em: string | null
          data_referencia: string
          id: string
          id_cadastro: string
          leitura_atual: number | null
          ponto_captacao: string
          tipo_medicao: string
          usuario: string
        }
        Insert: {
          cod_protheus?: string | null
          consumo_atual: number
          criado_em?: string | null
          data_referencia: string
          id?: string
          id_cadastro: string
          leitura_atual?: number | null
          ponto_captacao: string
          tipo_medicao: string
          usuario: string
        }
        Update: {
          cod_protheus?: string | null
          consumo_atual?: number
          criado_em?: string | null
          data_referencia?: string
          id?: string
          id_cadastro?: string
          leitura_atual?: number | null
          ponto_captacao?: string
          tipo_medicao?: string
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicao_id_fkey"
            columns: ["id_cadastro"]
            isOneToOne: false
            referencedRelation: "cadastro"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas: {
        Row: {
          calculo_metrica: string | null
          created_at: string
          descricao: string | null
          id: string
          indicador_id: string
          nome: string
          resultado: number | null
          segmentacao: string | null
          updated_at: string
        }
        Insert: {
          calculo_metrica?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          indicador_id: string
          nome: string
          resultado?: number | null
          segmentacao?: string | null
          updated_at?: string
        }
        Update: {
          calculo_metrica?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          indicador_id?: string
          nome?: string
          resultado?: number | null
          segmentacao?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "metricas_indicador_id_fkey"
            columns: ["indicador_id"]
            isOneToOne: false
            referencedRelation: "indicador"
            referencedColumns: ["id"]
          },
        ]
      }
      outorga: {
        Row: {
          bacia: string | null
          categoria_detalhada: string
          cod_tarifa: string
          cpf_cnpj: string | null
          criado_em: string | null
          fim_vigencia: string | null
          finalidade: string | null
          id: number
          inicio_vigencia: string | null
          latitude: number | null
          longitude: number | null
          municipio: string | null
          n_outorga: string | null
          n_pedido: string
          n_portaria: string | null
          n_processo: string | null
          nome_manancial: string | null
          nome_manancial_outro: string | null
          nome_razao_social: string | null
          tipo_empreendimento: string | null
          tipo_manancial: string | null
          vol_anual: number | null
        }
        Insert: {
          bacia?: string | null
          categoria_detalhada: string
          cod_tarifa: string
          cpf_cnpj?: string | null
          criado_em?: string | null
          fim_vigencia?: string | null
          finalidade?: string | null
          id?: number
          inicio_vigencia?: string | null
          latitude?: number | null
          longitude?: number | null
          municipio?: string | null
          n_outorga?: string | null
          n_pedido: string
          n_portaria?: string | null
          n_processo?: string | null
          nome_manancial?: string | null
          nome_manancial_outro?: string | null
          nome_razao_social?: string | null
          tipo_empreendimento?: string | null
          tipo_manancial?: string | null
          vol_anual?: number | null
        }
        Update: {
          bacia?: string | null
          categoria_detalhada?: string
          cod_tarifa?: string
          cpf_cnpj?: string | null
          criado_em?: string | null
          fim_vigencia?: string | null
          finalidade?: string | null
          id?: number
          inicio_vigencia?: string | null
          latitude?: number | null
          longitude?: number | null
          municipio?: string | null
          n_outorga?: string | null
          n_pedido?: string
          n_portaria?: string | null
          n_processo?: string | null
          nome_manancial?: string | null
          nome_manancial_outro?: string | null
          nome_razao_social?: string | null
          tipo_empreendimento?: string | null
          tipo_manancial?: string | null
          vol_anual?: number | null
        }
        Relationships: []
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
    Enums: {},
  },
} as const
