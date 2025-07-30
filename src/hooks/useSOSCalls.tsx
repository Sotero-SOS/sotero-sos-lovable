
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type SOSCall = Tables<'atendimento'>;
type SOSCallInsert = TablesInsert<'atendimento'>;
type SOSCallUpdate = TablesUpdate<'atendimento'>;

/**
 * Hook personalizado para gerenciar chamados SOS
 * 
 * @description Fornece operações CRUD para chamados SOS usando TanStack Query.
 * Inclui listagem, criação e atualização de chamados com cache automático.
 * 
 * @returns {Object} Objeto contendo:
 * - sosCalls: Array de chamados SOS
 * - isLoading: Estado de carregamento
 * - error: Erro caso ocorra
 * - createSOSCall: Mutação para criar chamado
 * - updateSOSCall: Mutação para atualizar chamado
 * 
 * @example
 * ```tsx
 * const { sosCalls, createSOSCall, updateSOSCall } = useSOSCalls();
 * 
 * const handleCreateSOS = (data) => {
 *   createSOSCall.mutate(data);
 * };
 * 
 * const handleComplete = (id) => {
 *   updateSOSCall.mutate({ id, updates: { status: 'completed' } });
 * };
 * ```
 */
export const useSOSCalls = () => {
  const queryClient = useQueryClient();

  const { data: sosCalls = [], isLoading, error } = useQuery({
    queryKey: ['atendimento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('atendimento')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createSOSCall = useMutation({
    mutationFn: async (sosCall: SOSCallInsert) => {
      const { data, error } = await supabase
        .from('atendimento')
        .insert([sosCall])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimento'] });
    },
  });

  const updateSOSCall = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: SOSCallUpdate }) => {
      const { data, error } = await supabase
        .from('atendimento')
        .update(updates)
        .eq('nr_atendimento', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimento'] });
    },
  });

  return {
    sosCalls,
    isLoading,
    error,
    createSOSCall,
    updateSOSCall,
  };
};
