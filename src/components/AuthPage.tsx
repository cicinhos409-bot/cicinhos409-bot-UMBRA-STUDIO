import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPageProps {
  onBack: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050407] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-umbra-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo/Back */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-umbra-accent rounded-md"></div>
            <span className="font-bold text-lg">UMBRA STUDIO</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl shadow-2xl">
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight mb-2">
              {mode === 'login' ? 'Fazer login' : 'Criar conta'}
            </h1>
            <p className="text-white/40 text-sm font-medium">
              {mode === 'login' 
                ? 'Bem-vindo de volta! Continue criando seus vídeos.' 
                : 'Comece sua jornada criativa com UMBRA STUDIO.'}
            </p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-3 py-3.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
              <Chrome size={20} className="text-white/60 group-hover:text-white" />
              <span className="text-sm font-bold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
              <Github size={20} className="text-white/60 group-hover:text-white" />
              <span className="text-sm font-bold">GitHub</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative px-4 bg-[#0a0a0a] text-[10px] font-bold text-white/20 uppercase tracking-widest">ou use seu email</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-umbra-accent transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="seuemail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-umbra-accent/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Senha</label>
                {mode === 'login' && (
                  <button type="button" className="text-[10px] font-bold text-umbra-accent uppercase tracking-widest hover:text-umbra-accent-hover transition-colors">
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-umbra-accent transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-umbra-accent/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-umbra-accent hover:bg-umbra-accent-hover text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-umbra-accent/20 flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                  {mode === 'login' ? 'Entrar' : 'Criar conta'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm font-medium text-white/40 hover:text-white transition-colors"
            >
              {mode === 'login' ? (
                <>Não tem uma conta? <span className="text-umbra-accent font-bold">Criar conta</span></>
              ) : (
                <>Já tem uma conta? <span className="text-umbra-accent font-bold">Fazer login</span></>
              )}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-center text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed">
          Ao continuar, você concorda com nossos <br />
          <a href="#" className="text-white/40 hover:text-white underline underline-offset-4">Termos de Serviço</a> e <a href="#" className="text-white/40 hover:text-white underline underline-offset-4">Privacidade</a>
        </p>
      </motion.div>
    </div>
  );
};
