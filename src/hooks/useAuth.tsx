import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock types para substituir o Supabase em ambiente de demonstração
// Mantém compatibilidade com o restante da aplicação sem depender de APIs externas.
type MockUser = {
  email: string;
  user_metadata?: { nome?: string };
};
type MockSession = null; // Não utilizamos sessão real neste mock

interface AuthContextType {
  user: MockUser | null;
  session: MockSession;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nome: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session] = useState<MockSession>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Mock de persistência simples via localStorage
    try {
      const raw = localStorage.getItem('mock_user');
      if (raw) {
        const parsed = JSON.parse(raw) as MockUser;
        setUser(parsed);
      }
    } catch {
      // ignora erros de parse
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock: aceita qualquer email/senha
    const mock: MockUser = {
      email: email,
      user_metadata: { nome: email?.split('@')[0] || 'Usuário' },
    };
    setUser(mock);
    try { localStorage.setItem('mock_user', JSON.stringify(mock)); } catch {}
    toast({ title: 'Login realizado', description: 'Acesso concedido (mock).' });
    return { error: null };
  };

  const signUp = async (email: string, password: string, nome: string) => {
    // Mock: cria usuário local e autentica
    const mock: MockUser = {
      email: email,
      user_metadata: { nome: nome || email?.split('@')[0] || 'Usuário' },
    };
    setUser(mock);
    try { localStorage.setItem('mock_user', JSON.stringify(mock)); } catch {}
    toast({ title: 'Cadastro realizado (mock)!', description: 'Conta criada localmente e acesso concedido.' });
    return { error: null };
  };

  const signOut = async () => {
    // Mock: limpa usuário local
    setUser(null);
    try { localStorage.removeItem('mock_user'); } catch {}
    toast({ title: 'Logout realizado', description: 'Você foi desconectado (mock).' });
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};