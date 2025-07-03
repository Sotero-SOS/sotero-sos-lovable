
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Vehicle = Tables<'vehicles'>;

export const useVehicles = () => {
  const { data: vehicles = [], isLoading } = useQuery({
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

  return {
    vehicles,
    isLoading,
  };
};
