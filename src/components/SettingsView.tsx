import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  Settings, 
  Gift, 
  BookOpen, 
  LogOut, 
  Cpu, 
  Image as ImageIcon, 
  Mic, 
  Video,
  ExternalLink,
  CheckCircle2,
  Copy,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsViewProps {
  onBack: () => void;
}

type SettingsTab = 'perfil' | 'planos' | 'assinaturas' | 'config' | 'resgatar' | 'tutoriais';

export default function SettingsView({ onBack }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('perfil');
  const [configSubTab, setConfigSubTab] = useState<'ia' | 'imagem' | 'audio' | 'video'>('ia');

  const sidebarItems = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'planos', label: 'Planos', icon: CreditCard },
    { id: 'assinaturas', label: 'Assinaturas', icon: CreditCard },
    { id: 'config', label: 'Configurações', icon: Settings },
    { id: 'resgatar', label: 'Resgatar', icon: Gift },
    { id: 'tutoriais', label: 'Tutoriais', icon: BookOpen },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Perfil</h2>
              <p className="text-umbra-muted">Dados da sua conta</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-umbra-muted">Nome</label>
                  <p className="text-lg font-medium">Usuário Umbra</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-umbra-muted">E-mail</label>
                  <p className="text-lg font-medium">usuario@exemplo.com</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-umbra-muted">Plano</label>
                  <p className="text-lg font-medium text-umbra-accent">Pro Explorer</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-umbra-muted">Término</label>
                  <p className="text-lg font-medium">Nunca</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-umbra-muted">Limite de projetos</label>
                  <p className="text-lg font-medium">0/10 projetos</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-umbra-muted">Reseta em</label>
                  <p className="text-lg font-medium">11/04/2026</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'planos':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Planos</h2>
              <p className="text-umbra-muted">Escolha o plano ideal para sua jornada criativa.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-umbra-muted mb-2">Básico</h3>
                  <div className="text-4xl font-black">R$ 0</div>
                  <p className="text-xs text-umbra-muted mt-2 font-medium">para sempre · sem cartão</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    '15 projetos por mês',
                    'Vídeos até 5 minutos',
                    'Geração de imagem ilimitada',
                    'Geração de vídeo ilimitada',
                    'Legendas automáticas',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-white/70 font-light">
                      <CheckCircle2 size={14} className="text-umbra-accent" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-umbra-muted cursor-not-allowed" disabled>
                  Plano Atual
                </button>
              </div>

              {/* Premium Plan */}
              <div className="p-8 bg-umbra-accent/5 border-2 border-umbra-accent rounded-[32px] flex flex-col relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-umbra-accent text-white text-[8px] font-bold uppercase tracking-widest rounded-full">
                  ⚡ Recomendado
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-umbra-accent mb-2">Premium</h3>
                  <div className="text-4xl font-black flex items-baseline gap-1">
                    <span className="text-xl">R$</span> 49,90
                  </div>
                  <p className="text-xs text-umbra-muted mt-2 font-medium">/mês · cancele quando quiser</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    'Projetos ilimitados',
                    'Vídeos até 10 minutos',
                    'Geração de imagem ilimitada',
                    'Geração de vídeo ilimitada',
                    'Legendas automáticas',
                    'Suporte prioritário',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-white font-medium">
                      <CheckCircle2 size={14} className="text-umbra-accent" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 bg-umbra-accent hover:bg-umbra-accent-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-umbra-accent/20 flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  Assinar Premium
                </button>
              </div>
            </div>
          </div>
        );

      case 'assinaturas':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Assinaturas</h2>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
              <p className="text-umbra-muted">Você não possui assinaturas ativas no momento.</p>
            </div>
          </div>
        );

      case 'config':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Configurações</h2>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                {[
                  { id: 'ia', label: 'IA', icon: Cpu },
                  { id: 'imagem', label: 'Imagem', icon: ImageIcon },
                  { id: 'audio', label: 'Áudio', icon: Mic },
                  { id: 'video', label: 'Vídeo', icon: Video },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setConfigSubTab(sub.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      configSubTab === sub.id 
                        ? 'bg-umbra-accent text-white' 
                        : 'text-umbra-muted hover:text-white'
                    }`}
                  >
                    <sub.icon size={16} />
                    <span className="text-sm font-bold">{sub.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {configSubTab === 'ia' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Pollinations', 'Groq', 'Puter', 'Ollama', 'OpenRouter', 'Google AI Studio'].map((provider) => (
                      <button key={provider} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-umbra-accent transition-all text-left">
                        <span className="font-bold">{provider}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">Pollinations</h3>
                      <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 size={14} />
                        Conectado com Pollinations
                      </div>
                    </div>

                    <button className="w-full py-4 rounded-xl bg-umbra-accent font-bold purple-glow hover:bg-umbra-accent-hover transition-all">
                      Conectar com Pollinations
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase tracking-widest text-umbra-muted">
                        <span className="bg-[#0a0a0a] px-4">Ou use chave API manualmente</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-umbra-muted mb-2">Chave API</label>
                        <div className="relative">
                          <input 
                            type="password" 
                            placeholder="Sua chave API aqui..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-umbra-accent outline-none transition-all"
                          />
                          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-umbra-muted hover:text-white">
                            <Copy size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-umbra-muted">
                        Gere sua chave API gratuitamente aqui: <a href="https://pollinations.ai" target="_blank" rel="noreferrer" className="text-umbra-accent hover:underline inline-flex items-center gap-1">Pollinations <ExternalLink size={12} /></a>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {configSubTab === 'imagem' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {['Cookies ImageFX', 'flow nano banana', 'meta'].map((provider) => (
                      <button key={provider} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-umbra-accent transition-all text-left">
                        <span className="font-bold">{provider}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                    <h3 className="text-xl font-bold">Cookies ImageFX</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-umbra-muted mb-2">Cookie do ImageFX</label>
                        <textarea 
                          rows={3}
                          placeholder="Cole seus cookies aqui..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-umbra-accent outline-none transition-all resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-umbra-muted mb-2">Chave API (Opcional)</label>
                        <input 
                          type="password" 
                          placeholder="Sua chave API aqui..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-umbra-accent outline-none transition-all"
                        />
                      </div>
                      <p className="text-sm text-umbra-muted">
                        Extraia seus cookies usando essa extensão: <a href="#" className="text-umbra-accent hover:underline inline-flex items-center gap-1">Cookies Extractor <ExternalLink size={12} /></a>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {configSubTab === 'audio' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <button className="p-6 rounded-2xl bg-white/5 border border-umbra-accent transition-all text-left flex items-center justify-between">
                      <span className="text-xl font-bold">Google Cloud</span>
                      <CheckCircle2 className="text-umbra-accent" />
                    </button>
                  </div>
                </div>
              )}

              {configSubTab === 'video' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {['DeAPI', 'APIFree'].map((provider) => (
                      <button key={provider} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-umbra-accent transition-all text-left">
                        <span className="font-bold">{provider}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                    <h3 className="text-xl font-bold">Chave API - DeAPI</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-umbra-muted mb-2">Cole sua chave API aqui</label>
                        <input 
                          type="password" 
                          placeholder="Sua chave API DeAPI..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-umbra-accent outline-none transition-all"
                        />
                      </div>
                      <p className="text-sm text-umbra-muted">
                        Gere sua chave API gratuitamente aqui: <a href="#" className="text-umbra-accent hover:underline inline-flex items-center gap-1">DeAPI <ExternalLink size={12} /></a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'resgatar':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Resgatar</h2>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <p className="text-umbra-muted">Insira seu código promocional ou de resgate abaixo.</p>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="CÓDIGO-123-ABC"
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-umbra-accent outline-none transition-all uppercase font-mono"
                />
                <button className="px-8 py-3 rounded-xl bg-umbra-accent font-bold purple-glow hover:bg-umbra-accent-hover transition-all">
                  Resgatar
                </button>
              </div>
            </div>
          </div>
        );

      case 'tutoriais':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Tutoriais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="w-12 h-12 bg-umbra-accent rounded-full flex items-center justify-center">
                        <BookOpen size={24} />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold group-hover:text-umbra-accent transition-colors">Como criar seu primeiro vídeo com IA</h3>
                  <p className="text-sm text-umbra-muted">5 minutos • Iniciante</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <div className="w-80 border-right border-white/5 bg-[#0a0a0a] flex flex-col p-6">
        <div className="flex items-center gap-3 mb-12">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xl font-bold tracking-tighter">CONFIGURAÇÕES</span>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SettingsTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-umbra-accent text-white purple-glow' 
                  : 'text-umbra-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
