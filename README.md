# Sistema SOS - Sotero Ambiental

Sistema de gerenciamento de chamados SOS para frota de veículos da Sotero Ambiental, desenvolvido com React, TypeScript e Supabase.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Configuração](#configuração)
- [Componentes Principais](#componentes-principais)
- [Hooks Personalizados](#hooks-personalizados)
- [Páginas](#páginas)
- [Banco de Dados](#banco-de-dados)
- [Autenticação e Permissões](#autenticação-e-permissões)

## 🎯 Visão Geral

O Sistema SOS é uma aplicação web para gerenciar chamados de emergência e manutenção da frota de veículos. Permite que usuários autorizados criem, monitorem e finalizem chamados SOS, além de gerenciar veículos e usuários do sistema.

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **State Management**: TanStack Query (React Query)
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                    # Componentes UI base (Shadcn)
│   ├── AppHeader.tsx          # Cabeçalho da aplicação
│   ├── AppLayout.tsx          # Layout principal
│   ├── AppSidebar.tsx         # Sidebar com navegação
│   ├── ErrorMessage.tsx       # Componente de erro
│   ├── Footer.tsx             # Rodapé
│   ├── LoadingSpinner.tsx     # Componente de loading
│   └── SOSCard.tsx            # Card de chamado SOS
├── hooks/
│   ├── useAuth.tsx            # Hook de autenticação
│   ├── useSOSCalls.tsx        # Hook para chamados SOS
│   ├── useUsers.tsx           # Hook para usuários
│   ├── useVehicles.tsx        # Hook para veículos
│   └── use-mobile.tsx         # Hook para detecção mobile
├── pages/
│   ├── CadastroUsuarios.tsx   # Página de cadastro de usuários
│   ├── Dashboard.tsx          # Dashboard principal
│   ├── Index.tsx              # Página inicial
│   ├── Login.tsx              # Página de login
│   ├── NotFound.tsx           # Página 404
│   ├── NovoSOS.tsx            # Página para criar SOS
│   ├── Perfil.tsx             # Página de perfil
│   └── Veiculos.tsx           # Página de gerenciamento de veículos
├── integrations/
│   └── supabase/              # Configuração Supabase
└── lib/
    └── utils.ts               # Utilitários
```

## ✨ Funcionalidades

### Dashboard
- Visualização de todos os chamados SOS
- Filtros por status (Em Espera, Em Atendimento, Finalizados, Atrasados)
- Busca por prefixo do veículo ou nome do motorista
- Contador de chamados por status
- Ações para visualizar detalhes e finalizar chamados

### Gerenciamento de SOS
- Criação de novos chamados SOS
- Seleção de veículo e tipo de problema
- Diagnósticos específicos (elétrica, mecânica, suspensão, compactador)
- Localização e descrição do problema
- Tempo estimado de resolução

### Gerenciamento de Veículos
- Listagem de todos os veículos
- Cadastro de novos veículos
- Edição de informações dos veículos
- Remoção de veículos (apenas admins)

### Gerenciamento de Usuários
- Cadastro de novos usuários (apenas admins)
- Definição de roles (Admin, Tráfego, Mecânico)
- Edição de perfis de usuários

### Autenticação
- Login seguro com Supabase Auth
- Controle de acesso baseado em roles
- Proteção de rotas

## ⚙️ Configuração

### Pré-requisitos
- Node.js 18+
- Conta no Supabase

### Instalação
```bash
# Clone o repositório
git clone <YOUR_GIT_URL>

# Navegue para o diretório
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm install

# Execute a aplicação
npm run dev
```

### Deploy
Para fazer deploy, acesse [Lovable](https://lovable.dev/projects/3b7e6d46-8fb8-4c9d-aa81-1fffb72bd0b9) e clique em Share -> Publish.

### Domínio Customizado
Para conectar um domínio, navegue para Project > Settings > Domains e clique em Connect Domain.

## 🧩 Componentes Principais

### `SOSCard`
```typescript
interface SOSCardProps {
  sos: SOSCall;
  onViewDetails: (id: string) => void;
  onComplete: (id: string) => void;
}
```
Exibe informações de um chamado SOS com ações para visualizar detalhes e finalizar.

### `AppSidebar`
Sidebar responsiva com navegação baseada em permissões do usuário.

### `AppLayout`
Layout principal que envolve todas as páginas autenticadas.

## 🎣 Hooks Personalizados

### `useAuth`
```typescript
interface AuthUser extends User {
  profile?: Profile;
}

const useAuth = () => {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{data: any, error: any}>;
  signOut: () => Promise<{error: any}>;
}
```

### `useSOSCalls`
```typescript
const useSOSCalls = () => {
  sosCalls: SOSCall[];
  isLoading: boolean;
  error: any;
  createSOSCall: UseMutationResult<SOSCall, Error, SOSCallInsert>;
  updateSOSCall: UseMutationResult<SOSCall, Error, {id: string, updates: SOSCallUpdate}>;
}
```

### `useVehicles`
```typescript
const useVehicles = () => {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: any;
  createVehicle: UseMutationResult<Vehicle, Error, VehicleInsert>;
  updateVehicle: UseMutationResult<Vehicle, Error, {id: string, updates: VehicleUpdate}>;
  deleteVehicle: UseMutationResult<void, Error, string>;
}
```

### `useUsers`
```typescript
const useUsers = () => {
  users: Profile[];
  isLoading: boolean;
  error: any;
  createUser: UseMutationResult<Profile, Error, ProfileInsert & {password: string}>;
  updateUser: UseMutationResult<Profile, Error, {id: string, updates: ProfileUpdate}>;
  deleteUser: UseMutationResult<void, Error, string>;
}
```

## 📄 Páginas

### `Dashboard`
- Página principal com visão geral dos chamados SOS
- Filtros e busca em tempo real
- Ações para gerenciar chamados

### `NovoSOS`
- Formulário para criação de novos chamados
- Validação com Zod
- Diagnósticos específicos por tipo de problema

### `Veiculos`
- Listagem e gerenciamento de veículos
- CRUD completo para veículos

### `CadastroUsuarios`
- Cadastro de novos usuários (apenas admins)
- Definição de roles e informações pessoais

### `Perfil`
- Visualização e edição do perfil do usuário logado

## 🗄️ Banco de Dados

### Tabelas Principais

#### `profiles`
```sql
- id: UUID (PK, FK para auth.users)
- full_name: TEXT
- email: TEXT
- phone: TEXT
- role: ENUM (admin, trafego, mecanico)
- avatar_url: TEXT
- created_at, updated_at: TIMESTAMP
```

#### `sos_calls`
```sql
- id: UUID (PK)
- vehicle_id: UUID (FK)
- vehicle_plate: TEXT
- vehicle_type: ENUM
- driver_name: TEXT
- location: TEXT
- status: ENUM (waiting, in-progress, completed, overdue)
- problem_type: TEXT
- description: TEXT
- estimated_time: INTEGER
- request_time: TIMESTAMP
- completion_time: TEXT
- diagnostico_*: TEXT[] (arrays para diagnósticos)
- pneu_furado: BOOLEAN
- pneu_posicoes: TEXT[]
- outros_problemas: TEXT
```

#### `vehicles`
```sql
- id: UUID (PK)
- plate: TEXT (UNIQUE)
- type: ENUM (Truck, Super Toco, Agilix, Triciclo)
- driver_name: TEXT
- location: TEXT
- status: TEXT
- last_activity: TIMESTAMP
- maintenance_type: TEXT
```

### Enums
```sql
- user_role: admin | trafego | mecanico
- sos_status: waiting | in-progress | completed | overdue
- vehicle_type: Truck | Super Toco | Agilix | Triciclo
```

## 🔐 Autenticação e Permissões

### Roles e Permissões

#### Admin
- Acesso total ao sistema
- Pode cadastrar usuários
- Pode gerenciar veículos
- Pode criar e gerenciar chamados SOS

#### Tráfego
- Pode criar chamados SOS
- Pode visualizar e gerenciar chamados
- Pode visualizar veículos
- Não pode cadastrar usuários

#### Mecânico
- Pode visualizar chamados SOS
- Pode finalizar chamados
- Pode visualizar veículos
- Não pode criar chamados ou cadastrar usuários

### Row Level Security (RLS)

O sistema utiliza RLS do Supabase para controle de acesso:

- **profiles**: Usuários podem ver/editar apenas seu próprio perfil, admins podem gerenciar todos
- **sos_calls**: Todos os usuários autenticados podem visualizar, apenas tráfego/admin podem criar
- **vehicles**: Todos visualizam, apenas admins podem modificar

### Proteção de Rotas

```typescript
// Rotas protegidas requerem autenticação
<ProtectedRoute>
  <ComponentePrivado />
</ProtectedRoute>

// Rotas públicas redirecionam se já logado
<PublicRoute>
  <Login />
</PublicRoute>
```

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com:

- **Vite** - Build tool e dev server
- **TypeScript** - Linguagem de programação
- **React** - Biblioteca para interface de usuário
- **Shadcn/ui** - Sistema de componentes
- **Tailwind CSS** - Framework de estilização
- **Supabase** - Backend as a Service
- **TanStack Query** - Gerenciamento de estado do servidor

## 📝 Notas de Desenvolvimento

- O sistema utiliza TypeScript com tipagem estrita
- Todos os componentes seguem os padrões do Shadcn/ui
- Estado global gerenciado com TanStack Query
- Formulários validados com Zod
- Design responsivo com Tailwind CSS
- Testes automatizados recomendados para futuras iterações

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
