
-- Criar enum para tipos de usuário
CREATE TYPE public.user_role AS ENUM ('admin', 'trafego', 'mecanico');

-- Criar enum para tipos de veículo
CREATE TYPE public.vehicle_type AS ENUM ('Truck', 'Super Toco', 'Agilix', 'Triciclo');

-- Criar enum para status do SOS
CREATE TYPE public.sos_status AS ENUM ('waiting', 'in-progress', 'completed', 'overdue');

-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'mecanico',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de veículos
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type vehicle_type NOT NULL,
  plate TEXT NOT NULL UNIQUE,
  driver_name TEXT NOT NULL,
  location TEXT DEFAULT 'Base Operacional',
  status TEXT DEFAULT 'circulating',
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  maintenance_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de chamados SOS
CREATE TABLE public.sos_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_type vehicle_type NOT NULL,
  vehicle_plate TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  location TEXT NOT NULL,
  problem_type TEXT DEFAULT 'Diagnóstico técnico',
  description TEXT,
  status sos_status DEFAULT 'waiting',
  estimated_time INTEGER DEFAULT 30,
  completion_time TEXT,
  request_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Campos de diagnóstico técnico
  diagnostico_eletrica TEXT[],
  diagnostico_mecanico TEXT[],
  diagnostico_compactador TEXT[],
  pneu_furado BOOLEAN DEFAULT FALSE,
  pneu_posicoes TEXT[],
  diagnostico_suspensao TEXT[],
  outros_problemas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_calls ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas RLS para vehicles
CREATE POLICY "All authenticated users can view vehicles" ON public.vehicles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage vehicles" ON public.vehicles
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas RLS para sos_calls
CREATE POLICY "All authenticated users can view SOS calls" ON public.sos_calls
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Trafego and admins can create SOS calls" ON public.sos_calls
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'trafego')
    )
  );

CREATE POLICY "All authenticated users can update SOS calls" ON public.sos_calls
  FOR UPDATE TO authenticated USING (true);

-- Trigger para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    'mecanico'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER sos_calls_updated_at
  BEFORE UPDATE ON public.sos_calls
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Inserir alguns dados de exemplo
INSERT INTO public.vehicles (type, plate, driver_name, location, status) VALUES
('Truck', '224009', 'José da Silva', 'Rota Itapuã - Centro', 'circulating'),
('Super Toco', '224015', 'Maria Santos', 'Av. Paralela - Pituaçu', 'circulating'),
('Agilix', '224032', 'Carlos Oliveira', 'Centro - Pelourinho', 'circulating'),
('Triciclo', '224048', 'Ana Costa', 'Base Operacional', 'inactive'),
('Truck', '224056', 'Pedro Santos', 'Base Operacional', 'inactive'),
('Super Toco', '224061', 'Roberto Lima', 'Oficina Mecânica', 'maintenance'),
('Agilix', '224078', 'Fernanda Silva', 'Oficina Elétrica', 'maintenance');
