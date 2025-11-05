import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { LogOut, Repeat2, LineChart, Waves, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

// Layout padrão dos Portais: Cabeçalho + Sidebar colapsável
// - Cabeçalho com logo, nome do sistema, nome do usuário, botão Trocar de Portal e Sair
// - Sidebar com gradiente azul (usando design tokens) e navegação
// - Um único SidebarTrigger no cabeçalho (conforme guideline)

interface PortalLayoutProps {
  children: React.ReactNode;
  title?: string; // opcional para mostrar no breadcrumb interno
  portalName: string; // nome específico do portal
  portalIcon?: 'waves' | 'chart'; // ícone específico do portal
}

// Componente interno que usa useSidebar
const SidebarHeader: React.FC<{ portalName: string; portalIcon: 'waves' | 'chart' }> = ({ portalName, portalIcon }) => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="p-2 mb-2">
      <button 
        onClick={toggleSidebar}
        className={cn(
          "flex items-center w-full hover:bg-white/10 rounded-md p-2 transition-colors",
          isCollapsed ? "justify-center" : "gap-2"
        )}
      >
        <Logo size="md" />
        {!isCollapsed && (
          <span className="text-white font-medium text-sm">
            SIH COGERH
          </span>
        )}
      </button>
    </div>
  );
};

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children, title, portalName, portalIcon = 'chart' }) => {
  const { user, signOut } = useAuth();
  const displayName = (user?.user_metadata?.nome as string) || user?.email || "Usuário";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <Sidebar
          // Força gradiente azul no container interno do Sidebar
          className="[&_[data-sidebar=sidebar]]:bg-gradient-primary [&_[data-sidebar=sidebar]]:text-white"
          collapsible="icon"
        >
          <SidebarContent>
            <SidebarGroup>
              <SidebarHeader portalName={portalName} portalIcon={portalIcon} />
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to="/portal/hidrologico"
                        end
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-2 rounded-md px-2 py-2",
                            isActive
                              ? "bg-white/15 text-white"
                              : "hover:bg-white/10 text-white/85"
                          )
                        }
                      >
                        <LineChart className="h-4 w-4" />
                        <span>Séries temporais</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Conteúdo */}
        <SidebarInset>
          {/* Cabeçalho */}
          <header className="sticky top-0 z-20 bg-gradient-header backdrop-blur-sm border-b">
            <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">{portalName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/portais")}
                  className="border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white transition-smooth"
                >
                  <Repeat2 className="h-4 w-4 mr-2" />
                  Trocar de portal
                </Button>
                <div className="px-3 text-sm text-muted-foreground hidden sm:block">
                  {displayName}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default PortalLayout;
