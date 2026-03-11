import React from 'react';
import { Check, X, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface PlansViewProps {
  onBack: () => void;
}

export default function PlansView({ onBack }: PlansViewProps) {
  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-bold mb-1">Planos e Assinaturas</h2>
          <p className="text-umbra-muted">Escolha o plano ideal para sua jornada criativa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10 bg-umbra-card border border-umbra-border rounded-[40px] flex flex-col"
        >
          <div className="mb-8">
            <h3 className="text-xl font-bold text-umbra-muted mb-2">Básico</h3>
            <div className="text-5xl font-black">R$ 0</div>
            <p className="text-sm text-umbra-muted mt-2 font-medium">para sempre · sem cartão</p>
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
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-umbra-muted cursor-not-allowed"
            disabled
          >
            Plano Atual
          </button>
        </motion.div>

        {/* Premium Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-10 bg-umbra-accent/5 border-2 border-umbra-accent rounded-[40px] flex flex-col relative shadow-2xl shadow-umbra-accent/10"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-umbra-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
            ⚡ Recomendado
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-umbra-accent mb-2">Premium</h3>
            <div className="text-5xl font-black flex items-baseline gap-1">
              <span className="text-2xl">R$</span> 49,90
            </div>
            <p className="text-sm text-umbra-muted mt-2 font-medium">/mês · cancele quando quiser</p>
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
            className="w-full py-4 bg-umbra-accent hover:bg-umbra-accent-hover text-white rounded-2xl font-bold transition-all shadow-xl shadow-umbra-accent/20 flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            Assinar Premium
          </button>
        </motion.div>
      </div>
    </div>
  );
}
