
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type SOSCall = Tables<'sos_calls'>;
type SOSCallInsert = TablesInsert<'sos_calls'>;
type SOSCallUpdate = TablesUpdate<'sos_calls'>;

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
    queryKey: ['sos_calls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sos_calls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createSOSCall = useMutation({
    mutationFn: async (sosCall: SOSCallInsert) => {
      const { data, error } = await supabase
        .from('sos_calls')
        .insert([sosCall])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sos_calls'] });
    },
  });

  const updateSOSCall = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: SOSCallUpdate }) => {
      const { data, error } = await supabase
        .from('sos_calls')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sos_calls'] });
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
