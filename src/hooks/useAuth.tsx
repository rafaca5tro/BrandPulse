import { useEffect, useState, createContext, useContext } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { storeUserEmail } from '@/services/stripeService';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  token: string | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  isSuperuser: boolean;
}

const SUPERUSER_EMAIL = "consulting@novastra.ae";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    const updateAuthState = (currentSession: Session | null) => {
      console.log("Updating auth state with session:", currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setToken(currentSession?.access_token ?? null);
      
      const userEmail = currentSession?.user?.email;
      const superuser = userEmail === SUPERUSER_EMAIL;
      setIsSuperuser(superuser);
      
      if (userEmail) {
        storeUserEmail(userEmail);
      }
      
      setLoading(false);

      if (currentSession?.user) {
        if (superuser) {
          toast.success(`Welcome Super User! (${userEmail})`, {
            description: 'You have unlimited access to all features.',
          });
        } else {
          toast.success('Login successful');
        }
      }
    };

    const getSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        return;
      }
      console.log("Initial Supabase session:", currentSession);
      updateAuthState(currentSession);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, "Session:", currentSession);
      updateAuthState(currentSession);

      if (event === 'SIGNED_OUT') {
        toast.info('You have been signed out');
      }
    });

    const refreshSession = async () => {
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error);
        return;
      }
      console.log("Refreshed Supabase session:", refreshedSession);
      updateAuthState(refreshedSession);
    };

    const refreshInterval = setInterval(refreshSession, 300000);

    return () => {
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: window.location.origin + '/auth',
        },
      });

      if (error) throw error;
      
      if (email === SUPERUSER_EMAIL) {
        setIsSuperuser(true);
        storeUserEmail(email);
        toast.success('Super User account created!', {
          description: 'You have unlimited access to all features.'
        });
      } else {
        toast.success('Registration successful', {
          description: 'Please check your email to confirm your account.'
        });
      }
      
      return { error: null };
    } catch (error) {
      toast.error(`Registration error: ${error.message}`);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      storeUserEmail(email);
      
      return { error: null };
    } catch (error) {
      toast.error(`Login error: ${error.message}`);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      storeUserEmail("");
      
      return { error: null };
    } catch (error) {
      toast.error(`Sign out error: ${error.message}`);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      token, 
      loading, 
      signUp, 
      signIn, 
      signOut,
      isSuperuser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
