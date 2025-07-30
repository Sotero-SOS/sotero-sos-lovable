
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Profile = Tables<'user'>;
type ProfileInsert = TablesInsert<'user'>;
type ProfileUpdate = TablesUpdate<'user'>;

/**
 * Hook personalizado para gerenciar usuários/perfis
 * 
 * @description Fornece operações CRUD para perfis de usuários usando TanStack Query.
 * Inclui listagem, criação, atualização e exclusão de usuários com cache automático.
 * 
 * @returns {Object} Objeto contendo:
 * - users: Array de perfis de usuários
 * - isLoading: Estado de carregamento
 * - error: Erro caso ocorra
 * - createUser: Mutação para criar usuário
 * - updateUser: Mutação para atualizar usuário
 * - deleteUser: Mutação para excluir usuário
 * 
 * @example
 * ```tsx
 * const { users, createUser, updateUser } = useUsers();
 * 
 * const handleCreateUser = (userData) => {
 *   createUser.mutate({ ...userData, password: 'temp123' });
 * };
 * 
 * const handleUpdateUser = (id, updates) => {
 *   updateUser.mutate({ id, updates });
 * };
 * ```
 */
export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createUser = useMutation({
    mutationFn: async (userData: ProfileInsert & { password: string }) => {
      // Em um ambiente real, isso seria feito através de uma função admin do Supabase
      // Por agora, vamos simular a criação do perfil
      const { password, ...profileData } = userData;
      
      const { data, error } = await supabase
        .from('user')
        .insert([profileData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: ProfileUpdate }) => {
      const { data, error } = await supabase
        .from('user')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('user')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
  };
};
