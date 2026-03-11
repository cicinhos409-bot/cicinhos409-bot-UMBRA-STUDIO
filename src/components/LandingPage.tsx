import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  ChevronRight, 
  Check, 
  X, 
  Star, 
  ArrowRight,
  Zap,
  Users,
  ShieldCheck,
  Layout,
  MessageSquare,
  Mic,
  Video,
  Palette,
  Smartphone,
  Monitor,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    { num: '01', icon: '📝', title: 'Escreva o Roteiro', desc: 'Cole ou escreva seu texto. Cada quebra de linha vira uma cena automaticamente.' },
    { num: '02', icon: '🎞️', title: 'Organize as Cenas', desc: 'Edite, reordene e exclua cenas arrastando. Controle total sobre a estrutura.' },
    { num: '03', icon: '🎨', title: 'Estilo e Formato', desc: 'Escolha a proporção (9:16, 1:1, 16:9) e o estilo artístico para todas as imagens.' },
    { num: '04', icon: '🧑‍🎤', title: 'Configure Personagens', desc: 'Defina e gerencie personagens consistentes em todas as cenas da história.' },
    { num: '05', icon: '🎭', title: 'Escale o Elenco', desc: 'Decida quais personagens aparecem em cada cena — até 4 por cena.' },
    { num: '06', icon: '🏙️', title: 'Ambientes', desc: 'Configure cenários consistentes. Ajuste descrições e deixe tudo coerente.' },
    { num: '07', icon: '🖼️', title: 'Storyboard', desc: 'Edite e anime as imagens. A miniatura escolhida vira a base do vídeo final.' },
    { num: '08', icon: '🎬', title: 'Exporte o Vídeo', desc: 'Monte, ajuste e exporte em Full HD pronto para YouTube, TikTok e Instagram.' },
  ];

  const features = [
    { icon: <Zap className="text-umbra-accent" />, title: 'IA para cada etapa', desc: 'Mais de 100 modelos de IA disponíveis para gerar imagens, vídeos, áudios e roteiros.', size: 'col-span-12 md:col-span-5' },
    { icon: <Users className="text-umbra-accent" />, title: 'Personagens Consistentes', desc: 'Mantenha o mesmo rosto, roupa e estilo do personagem em todas as cenas automaticamente.', size: 'col-span-12 md:col-span-7', highlight: true },
    { icon: <Smartphone className="text-umbra-accent" />, title: 'PC e Celular', desc: 'Use em qualquer dispositivo, a qualquer hora.', size: 'col-span-12 md:col-span-4' },
    { icon: <MessageSquare className="text-umbra-accent" />, title: 'Legendas Automáticas', desc: 'Geradas automaticamente, sincronizadas e prontas para exportar.', size: 'col-span-12 md:col-span-4' },
    { icon: <Mic className="text-umbra-accent" />, title: 'Narração por IA', desc: 'Vozes naturais geradas automaticamente para cada cena.', size: 'col-span-12 md:col-span-4' },
    { icon: <Video className="text-umbra-accent" />, title: 'Editor Profissional', desc: 'Ajuste timing, transições, cortes e efeitos sem sair da plataforma.', size: 'col-span-12 md:col-span-7', highlight: true },
    { icon: <ShieldCheck className="text-umbra-accent" />, title: 'Licença Comercial', desc: 'Todo conteúdo gerado vem com licença comercial inclusa.', size: 'col-span-12 md:col-span-5' },
  ];

  const reviews = [
    { name: 'Marina Editora', handle: '@marina.editora', text: 'Em 10 minutos já tinha o storyboard pronto. Economizei um dia inteiro de pré-produção.', avatar: 'M', color: 'bg-purple-600' },
    { name: 'Lucas Videos', handle: '@lucas.videos', text: 'O fluxo é muito intuitivo. Consigo revisar cenas, ajustar personagens e exportar tudo no mesmo lugar.', avatar: 'L', color: 'bg-blue-600' },
    { name: 'Ana Motion', handle: '@ana.motion', text: 'Use para fechar um job de branding. O cliente aprovou na primeira revisão sem pedir nenhum ajuste.', avatar: 'A', color: 'bg-orange-600' },
    { name: 'Rafa Short', handle: '@rafa.short', text: 'Agora consigo publicar 3x mais vídeos por semana sem me perder no roteiro. É viciante!', avatar: 'R', color: 'bg-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-[#050407] text-white font-sans selection:bg-umbra-accent/30">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-[#050407]/80 backdrop-blur-xl border-white/10 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-umbra-accent to-purple-400 rounded-lg shadow-lg shadow-umbra-accent/20"></div>
            <span className="font-bold text-xl tracking-tight">UMBRA STUDIO</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Como funciona</a>
            <a href="#planos" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Planos</a>
            <a href="#avaliacoes" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Avaliações</a>
            <button onClick={onLogin} className="text-sm font-medium text-white/60 hover:text-white transition-colors">Entrar</button>
            <button 
              onClick={onStart}
              className="bg-umbra-accent hover:bg-umbra-accent-hover text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-umbra-accent/20"
            >
              Começar grátis
            </button>
          </div>

          <button onClick={onLogin} className="md:hidden p-2 hover:bg-white/5 rounded-lg">
            <Users size={20} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-umbra-accent/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #8b5cf6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-umbra-accent/10 border border-umbra-accent/20 text-umbra-accent text-xs font-bold uppercase tracking-widest mb-8"
          >
            <div className="w-1.5 h-1.5 bg-umbra-accent rounded-full animate-ping"></div>
            IA de última geração · Sem cartão de crédito
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
          >
            Crie vídeos virais <br />
            <span className="bg-gradient-to-r from-umbra-accent to-purple-400 bg-clip-text text-fill-transparent">em minutos com IA</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            Do roteiro ao vídeo final em um único fluxo. Personagens consistentes, narração automática, legendas e edição profissional — tudo gerado pela IA para você publicar mais rápido.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={onStart}
              className="w-full md:w-auto px-10 py-5 bg-umbra-accent hover:bg-umbra-accent-hover text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-umbra-accent/40 flex items-center justify-center gap-3 group"
            >
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              Criar meu primeiro vídeo
            </button>
            <a 
              href="#como-funciona"
              className="w-full md:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3"
            >
              <Play size={20} fill="white" />
              Ver como funciona
            </a>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-sm text-white/40 font-medium"
          >
            Grátis para sempre · Sem cartão · Cancele quando quiser
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { num: '50K+', label: 'Criadores ativos' },
            { num: '2M+', label: 'Vídeos gerados' },
            { num: '10x', label: 'Mais rápido' },
            { num: '100+', label: 'Modelos de IA' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black mb-2 text-white">{stat.num}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-umbra-accent text-sm font-bold uppercase tracking-[0.2em] mb-4 block">Como funciona</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">De zero ao vídeo final <br /> em 8 passos simples</h2>
            <p className="text-lg text-white/60 max-w-xl mx-auto font-light">Um fluxo guiado que transforma seu roteiro em vídeo publicável sem precisar de experiência técnica.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-umbra-accent/50 transition-all hover:-translate-y-1">
                <div className="text-[10px] font-bold text-umbra-accent uppercase tracking-widest mb-4">Passo {step.num}</div>
                <div className="text-4xl mb-6">{step.icon}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento */}
      <section className="py-32 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <span className="text-umbra-accent text-sm font-bold uppercase tracking-[0.2em] mb-4 block">Recursos</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Tudo que você precisa, <br /> em um só lugar</h2>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {features.map((f, i) => (
              <div 
                key={i} 
                className={`${f.size} group p-10 rounded-[40px] border border-white/10 transition-all hover:border-umbra-accent/50 relative overflow-hidden ${f.highlight ? 'bg-umbra-accent/5 border-umbra-accent/20' : 'bg-white/5'}`}
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-white/50 font-light leading-relaxed">{f.desc}</p>
                
                {/* Decorative Glow */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-umbra-accent/5 rounded-full blur-3xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-umbra-accent text-sm font-bold uppercase tracking-[0.2em] mb-4 block">Planos</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Simples e transparente</h2>
            <p className="text-lg text-white/60 max-w-xl mx-auto font-light">Comece grátis. Escale quando precisar. Sem surpresas na fatura.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-12 bg-white/5 border border-white/10 rounded-[40px] flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white/60 mb-2">Básico</h3>
                <div className="text-5xl font-black">R$ 0</div>
                <p className="text-sm text-white/40 mt-2 font-medium">para sempre · sem cartão</p>
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                {[
                  '15 projetos por mês',
                  'Vídeos até 5 minutos',
                  'Geração de imagem ilimitada',
                  'Geração de vídeo ilimitada',
                  'Geração de áudio ilimitada',
                  'Legendas automáticas',
                  'Personagens consistentes',
                  'Exportação em Full HD',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70 font-light">
                    <Check size={16} className="text-umbra-accent" />
                    {item}
                  </li>
                ))}
                <li className="flex items-center gap-3 text-sm text-white/30 font-light">
                  <X size={16} />
                  Acesso aos prompts
                </li>
              </ul>

              <button 
                onClick={onStart}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all"
              >
                Começar grátis
              </button>
            </div>

            {/* Premium Plan */}
            <div className="p-12 bg-umbra-accent/5 border-2 border-umbra-accent rounded-[40px] flex flex-col relative shadow-2xl shadow-umbra-accent/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-umbra-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                ⚡ Recomendado
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-umbra-accent mb-2">Premium</h3>
                <div className="text-5xl font-black flex items-baseline gap-1">
                  <span className="text-2xl">R$</span> 49,90
                </div>
                <p className="text-sm text-white/40 mt-2 font-medium">/mês · cancele quando quiser</p>
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                {[
                  'Projetos ilimitados',
                  'Vídeos até 10 minutos',
                  'Geração de imagem ilimitada',
                  'Geração de vídeo ilimitada',
                  'Geração de áudio ilimitada',
                  'Legendas automáticas',
                  'Personagens consistentes',
                  'Exportação em Full HD',
                  'Acesso completo aos prompts',
                  'Suporte 24h prioritário',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white font-medium">
                    <Check size={16} className="text-umbra-accent" />
                    {item}
                  </li>
                ))}
              </ul>

              <button 
                onClick={onStart}
                className="w-full py-4 bg-umbra-accent hover:bg-umbra-accent-hover text-white rounded-2xl font-bold transition-all shadow-xl shadow-umbra-accent/20"
              >
                Assinar Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-umbra-accent/5 blur-3xl rounded-full scale-150 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="p-16 md:p-24 bg-white/5 border border-white/10 rounded-[60px] backdrop-blur-xl">
            <span className="text-umbra-accent text-sm font-bold uppercase tracking-[0.2em] mb-6 block">Comece agora</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Seu próximo vídeo viral <br /> começa aqui</h2>
            <p className="text-lg text-white/60 mb-12 font-light">Grátis para sempre. Sem cartão de crédito. Sem complicação.</p>
            
            <button 
              onClick={onStart}
              className="px-12 py-6 bg-umbra-accent hover:bg-umbra-accent-hover text-white rounded-2xl font-bold text-xl transition-all shadow-2xl shadow-umbra-accent/40 flex items-center justify-center gap-3 mx-auto group"
            >
              ✦ Criar conta grátis
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="mt-8 text-sm text-white/40 font-medium">
              Mais de 50.000 criadores já usam · Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-umbra-accent rounded-md"></div>
              <span className="font-bold text-lg">UMBRA STUDIO</span>
            </div>
            <p className="text-sm text-white/40 font-light">© 2025 UMBRA STUDIO. Todos os direitos reservados.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Termos</a>
            <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Contato</a>
            <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Afiliados</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
