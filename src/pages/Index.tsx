import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  // Redirect all users to auth page (login/signup)
  return <Navigate to="/auth" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Logo className="justify-center mb-8" size="lg" />
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent mb-6">
            Sistema de Integração Hidrológico
          </h1>
          
          <h2 className="text-2xl text-primary mb-8">
            Sistema de Vazões e Reservatórios
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Monitore vazões e volumes de trechos da infraestrutura gerenciada pela COGERH 
            e acesse dados volumétricos, cotas e vazões de reservatórios de água do Estado do Ceará.
          </p>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              size="lg"
              className="bg-gradient-primary shadow-primary hover:shadow-hover transition-smooth px-8 py-3 text-lg"
              onClick={() => window.location.href = '/auth'}
            >
              Acessar Sistema
            </Button>
          </div>
          
          <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-card">
              <h3 className="text-xl font-semibold text-primary-dark mb-3">
                Portal Jaguaribe RMF
              </h3>
              <p className="text-muted-foreground">
                Gerenciamento de vazões dos trechos da infraestrutura Jaguaribe e 
                Região Metropolitana de Fortaleza
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-card">
              <h3 className="text-xl font-semibold text-primary-dark mb-3">
                Portal Hidrológico
              </h3>
              <p className="text-muted-foreground">
                Dados volumétricos, cotas e vazões de reservatórios de água 
                do Estado do Ceará
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 COGERH - Companhia de Gestão do Estado do Ceará
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
