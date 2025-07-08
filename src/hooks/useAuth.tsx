
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface AuthUser extends User {
  profile?: Profile;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth: Iniciando verificação de autenticação');
    
    // Timeout de segurança para evitar loading infinito
    const timeoutId = setTimeout(() => {
      console.log('useAuth: Timeout de segurança - definindo loading como false');
      setLoading(false);
    }, 10000); // 10 segundos
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth: Sessão inicial:', session ? 'Existe' : 'Não existe');
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        console.log('useAuth: Nenhuma sessão encontrada, definindo loading como false');
        setLoading(false);
      }
      clearTimeout(timeoutId);
    }).catch(error => {
      console.error('useAuth: Erro ao obter sessão:', error);
      setLoading(false);
      clearTimeout(timeoutId);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('useAuth: Mudança de estado de auth:', event, session ? 'Sessão existe' : 'Sem sessão');
        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      console.log('useAuth: Buscando perfil do usuário:', authUser.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('useAuth: Erro ao buscar perfil:', error);
        setUser(authUser);
      } else {
        console.log('useAuth: Perfil encontrado:', profile ? 'Sim' : 'Não');
        setUser({ ...authUser, profile: profile || undefined });
      }
    } catch (error) {
      console.error('useAuth: Erro inesperado ao buscar perfil:', error);
      setUser(authUser);
    } finally {
      console.log('useAuth: Definindo loading como false');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
};
