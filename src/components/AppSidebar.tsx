
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  AlertCircle, 
  Circle, 
  User,
  UserPlus
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

/**
 * Configuração dos itens de menu da sidebar
 * Cada item possui título, URL, ícone e roles permitidos
 */
const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["Administrador", "Tráfego", "Mecânico"]
  },
  {
    title: "Iniciar SOS",
    url: "/novo-sos",
    icon: AlertCircle,
    allowedRoles: ["Administrador", "Tráfego"]
  },
  {
    title: "Veículos",
    url: "/veiculos",
    icon: Circle,
    allowedRoles: ["Administrador", "Tráfego", "Mecânico"]
  },
  {
    title: "Cadastro de Usuários",
    url: "/cadastro-usuarios",
    icon: UserPlus,
    allowedRoles: ["Administrador"]
  },
  {
    title: "Perfil",
    url: "/perfil",
    icon: User,
    allowedRoles: ["Administrador", "Tráfego", "Mecânico"]
  },
];

/**
 * Componente de sidebar da aplicação
 * 
 * @description Exibe a navegação lateral da aplicação com menu baseado em permissões.
 * Mostra logo da empresa, itens de menu filtrados por role do usuário e botão de logout.
 * Suporta estado colapsado/expandido.
 * 
 * @returns JSX Element da sidebar
 */
export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isCollapsed = state === "collapsed";

  /**
   * Converte roles do banco de dados para nomes de exibição
   * @param role Role do usuário no banco (admin, trafego, mecanico)
   * @returns Nome do role para exibição
   */
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin": return "Administrador";
      case "trafego": return "Tráfego";
      case "mecanico": return "Mecânico";
      default: return "Tráfego";
    }
  };

  const userRole = user?.profile?.role ? getRoleDisplayName(user.profile.role) : "Tráfego";

  // Filtrar itens do menu baseado na permissão do usuário
  const filteredMenuItems = menuItems.filter(item => 
    item.allowedRoles.includes(userRole)
  );

  /**
   * Manipula o logout do usuário
   * Chama signOut do hook useAuth e redireciona para home
   */
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <img 
            src="/lovable-uploads/b7e8b7f6-44a9-4caf-82c7-87c7325cddb2.png" 
            alt="Sotero Ambiental" 
            className={`transition-all duration-200 ${isCollapsed ? "h-10" : "h-16"} mx-auto`}
          />
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "hidden" : ""}>
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={location.pathname === item.url ? "bg-sotero-blue text-white" : ""}
                  >
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {!isCollapsed && "Sair"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
