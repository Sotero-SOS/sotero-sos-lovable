
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Vehicle = Tables<'vehicles'>;
type VehicleInsert = TablesInsert<'vehicles'>;
type VehicleUpdate = TablesUpdate<'vehicles'>;

/**
 * Hook personalizado para gerenciar veículos
 * 
 * @description Fornece operações CRUD completas para veículos usando TanStack Query.
 * Inclui listagem, criação, atualização e exclusão de veículos com cache automático.
 * 
 * @returns {Object} Objeto contendo:
 * - vehicles: Array de veículos
 * - isLoading: Estado de carregamento
 * - error: Erro caso ocorra
 * - createVehicle: Mutação para criar veículo
 * - updateVehicle: Mutação para atualizar veículo
 * - deleteVehicle: Mutação para excluir veículo
 * 
 * @example
 * ```tsx
 * const { vehicles, createVehicle, deleteVehicle } = useVehicles();
 * 
 * const handleCreate = (data) => {
 *   createVehicle.mutate(data);
 * };
 * 
 * const handleDelete = (id) => {
 *   deleteVehicle.mutate(id);
 * };
 * ```
 */
export const useVehicles = () => {
  const queryClient = useQueryClient();

  const { data: vehicles = [], isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('plate', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createVehicle = useMutation({
    mutationFn: async (vehicleData: VehicleInsert) => {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicleData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const updateVehicle = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: VehicleUpdate }) => {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const deleteVehicle = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  return {
    vehicles,
    isLoading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
};
