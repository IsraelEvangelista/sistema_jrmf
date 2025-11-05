import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Waves, BarChart3, LogOut } from 'lucide-react';

const PortalSelector = () => {
  const { user, loading, signOut } = useAuth();

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const portals = [
    {
      id: 'jaguaribe-rmf',
      title: 'Portal de Vazões Jaguaribe RMF',
      description: 'Gerenciamento de vazões dos trechos da infraestrutura Jaguaribe e Região Metropolitana de Fortaleza',
      icon: Waves,
      gradient: 'bg-gradient-primary',
      href: '/portal/jaguaribe-rmf'
    },
    {
      id: 'hidrologico',
      title: 'Portal Hidrológico COGERH',
      description: 'Dados volumétricos, cotas e vazões de reservatórios de água do Estado do Ceará',
      icon: BarChart3,
      gradient: 'bg-gradient-primary', // Unificado para usar o design do portal Jaguaribe RMF
      href: '/portal/hidrologico'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-header backdrop-blur-sm border-b border-border/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            <span className="text-primary-dark font-medium">
              Bem-vindo, {user?.email}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={signOut}
              className="border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white transition-smooth"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-dark mb-4">
            Selecione o Portal de Acesso
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o portal que deseja acessar para visualizar e gerenciar os dados hidrológicos do Estado do Ceará
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {portals.map((portal) => (
            <Card 
              key={portal.id} 
              className="group hover:shadow-hover transition-all duration-300 cursor-pointer border-primary/20 hover:border-primary/40 flex flex-col h-full"
              onClick={() => window.location.href = portal.href}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full ${portal.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <portal.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-primary-dark group-hover:text-primary transition-colors">
                  {portal.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center flex flex-col h-full">
                <CardDescription className="text-base mb-6 flex-grow">
                  {portal.description}
                </CardDescription>
                <Button 
                  className="w-full bg-gradient-primary shadow-primary hover:shadow-hover transition-smooth mt-auto"
                >
                  Acessar Portal
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            © 2024 COGERH - Companhia de Gestão do Estado do Ceará
          </p>
        </div>
      </main>
    </div>
  );
};

export default PortalSelector;