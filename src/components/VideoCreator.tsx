import React, { useState } from 'react';
import { 
  FileText, 
  Clapperboard, 
  Palette, 
  Users, 
  UserSquare2, 
  Mountain, 
  Image as ImageIcon, 
  Video,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Wand2,
  HelpCircle,
  Languages,
  Layers,
  Clock,
  GripVertical,
  Trash2,
  Edit3,
  Monitor,
  Smartphone,
  Square,
  PlusCircle,
  Search,
  Copy,
  RefreshCw,
  MoreHorizontal,
  Download,
  Trash2 as Trash,
  Image as ImageAction,
  Clock as Time,
  History,
  Maximize2,
  Mic,
  Music,
  Type,
  Scissors,
  Zap,
  ShieldAlert,
  Upload,
  Key,
  Expand,
  Play,
  Settings2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoCreatorProps {
  projectName: string;
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, label: 'Roteiro', icon: FileText },
  { id: 2, label: 'Cenas', icon: Clapperboard },
  { id: 3, label: 'Estilo', icon: Palette },
  { id: 4, label: 'Personagens', icon: Users },
  { id: 5, label: 'Elenco', icon: UserSquare2 },
  { id: 6, label: 'Ambientes', icon: Mountain },
  { id: 7, label: 'Imagens', icon: ImageIcon },
  { id: 8, label: 'Edição', icon: Video },
];

export default function VideoCreator({ projectName, onComplete, onCancel }: VideoCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [scriptMode, setScriptMode] = useState<'ia' | 'manual'>('ia');
  const [language, setLanguage] = useState('Português');
  const [sceneCount, setSceneCount] = useState(10);
  const [storyIdea, setStoryIdea] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [scenes, setScenes] = useState([
    { id: '1', content: 'Cena 1: O início da jornada do herói em uma floresta densa.' },
    { id: '2', content: 'Cena 2: O encontro com o sábio ancião na caverna de cristal.' },
    { id: '3', content: 'Cena 3: A descoberta do mapa antigo escondido sob as raízes.' },
  ]);
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [selectedStyle, setSelectedStyle] = useState('Realista');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [characterStep, setCharacterStep] = useState(1);
  const [characters, setCharacters] = useState<any[]>([]);
  const [characterFilter, setCharacterFilter] = useState('Todos');
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportSettings, setShowExportSettings] = useState(false);
  const [exportResolution, setExportResolution] = useState('1080p');
  const [exportFps, setExportFps] = useState('30');
  const [editorLoading, setEditorLoading] = useState(true);

  // Mock data for Step 4
  const [mockCharacters, setMockCharacters] = useState([
    { id: '1', name: 'Lucas', type: 'Humanos', prompt: 'Jovem de 23 anos, vestindo roupas simples, expressão determinada, estilo realista.', variations: ['V1'] }
  ]);

  // Mock scenes for Step 5-7
  const fullScenes = [
    { id: '1', title: 'Cena 1', content: 'Você já imaginou mudar de vida usando apenas a internet? 💻💰', prompt: 'Lucas segurando um smartphone, luz vindo da tela refletindo em seu rosto, fundo de quarto escuro.', duration: '00:05' },
    { id: '2', title: 'Cena 2', content: 'Essa é a história de Lucas, um jovem de 23 anos que morava em uma casa simples com a mãe e trabalhava o dia inteiro em um emprego que mal pagava suas contas.', prompt: 'Lucas caminhando cansado voltando do trabalho, rua residencial simples ao entardecer.', duration: '00:12' },
    { id: '3', title: 'Cena 3', content: 'Uma noite, mexendo no celular antes de dormir, Lucas viu um vídeo sobre pessoas que ganhavam dinheiro pela internet.', prompt: 'Lucas deitado na cama, olhando para o celular com expressão de surpresa e curiosidade.', duration: '00:10' },
    { id: '4', title: 'Cena 4', content: 'Foi naquele momento que a jornada de Lucas começou… e ela poderia mudar tudo.', prompt: 'Close no rosto de Lucas, olhos brilhando com esperança, luz do amanhecer entrando pela janela.', duration: '00:08' },
  ];

  const characterSteps = [
    'Identificando personagens',
    'Criando descrições detalhadas',
    'Montando prompts para imagens',
    'Gerando imagens dos personagens'
  ];

  const styles = [
    { id: 'Geométrico', label: 'Geométrico', description: 'Estilo Geométrico' },
    { id: 'Pintura', label: 'Pintura', description: 'Estilo Pintura Digital' },
    { id: 'Anime', label: 'Anime', description: 'Estilo Anime' },
    { id: 'Disney', label: 'Disney', description: 'Estilo Disney Pixar 3D' },
    { id: 'Comic Book', label: 'Comic Book', description: 'Estilo Comic Book' },
    { id: 'Realista', label: 'Realista', description: 'Estilo Realista Cinematográfico' },
    { id: 'Cartoon', label: 'Cartoon', description: 'Estilo Cartoon' },
    { id: 'Vetorial', label: 'Vetorial', description: 'Estilo Vetorial' },
    { id: 'Minecraft', label: 'Minecraft', description: 'Estilo Minecraft' },
    { id: 'Picture Book', label: 'Picture Book', description: 'Estilo Picture Book' },
  ];

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({});
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Passo 1: Roteiro</h2>
                <p className="text-umbra-muted">Gere ou escreva seu roteiro</p>
              </div>
              <div className="flex items-center gap-2 text-umbra-accent bg-umbra-accent/10 px-4 py-2 rounded-xl text-sm font-bold">
                <Layers size={18} />
                Templates
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Script Mode Toggle */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-1 flex">
                <button
                  onClick={() => setScriptMode('ia')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all ${
                    scriptMode === 'ia' ? 'bg-umbra-accent text-white' : 'text-umbra-muted hover:text-white'
                  }`}
                >
                  <Sparkles size={18} />
                  <span className="font-bold">Roteiro com IA</span>
                </button>
                <button
                  onClick={() => setScriptMode('manual')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all ${
                    scriptMode === 'manual' ? 'bg-umbra-accent text-white' : 'text-umbra-muted hover:text-white'
                  }`}
                >
                  <FileText size={18} />
                  <span className="font-bold">Roteiro manual</span>
                </button>
              </div>

              {/* Language & Scenes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-umbra-muted flex items-center gap-2">
                    <Languages size={14} /> Idioma
                  </label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-umbra-accent outline-none transition-all appearance-none"
                  >
                    <option value="Português">Português</option>
                    <option value="English">English</option>
                    <option value="Español">Español</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-umbra-muted flex items-center gap-2">
                    <Clapperboard size={14} /> Cenas
                  </label>
                  <input 
                    type="number"
                    value={sceneCount}
                    onChange={(e) => setSceneCount(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:border-umbra-accent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Story Idea */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-umbra-muted">Sua ideia de história</label>
                <button 
                  onClick={() => setIsEnhancing(true)}
                  className="flex items-center gap-2 text-umbra-accent hover:text-umbra-accent-hover transition-colors text-sm font-bold"
                >
                  <Wand2 size={16} />
                  Aprimorar
                </button>
              </div>
              <div className="relative">
                <textarea 
                  value={storyIdea}
                  onChange={(e) => setStoryIdea(e.target.value)}
                  placeholder="Descreva brevemente como deseja que a história seja..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 h-48 focus:border-umbra-accent outline-none transition-all resize-none text-lg"
                  maxLength={1000}
                />
                <div className="absolute bottom-4 right-6 text-xs text-umbra-muted font-mono">
                  {storyIdea.length}/1000
                </div>
              </div>
              
              {isEnhancing && (
                <div className="flex items-center gap-3 text-umbra-accent animate-pulse">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-sm font-bold">Aprimorando prompt...</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-8">
              <button className="flex items-center gap-2 text-umbra-muted hover:text-white transition-colors text-sm font-bold">
                <HelpCircle size={18} />
                Como funciona
              </button>
              <button 
                onClick={handleNext}
                className="px-12 py-4 rounded-2xl bg-umbra-accent font-bold text-white purple-glow hover:bg-umbra-accent-hover transition-all flex items-center gap-2"
              >
                Próximo
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Passo 2: Organizar Cenas</h2>
                <p className="text-umbra-muted">Edite, reordene ou exclua cenas.</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 text-umbra-muted text-sm font-bold">
                  <Clock size={16} />
                  Tempo de vídeo: <span className="text-white">00:45</span>
                </div>
                <button 
                  onClick={() => setIsGeneratingStory(true)}
                  className="flex items-center gap-2 text-umbra-accent bg-umbra-accent/10 px-4 py-2 rounded-xl text-sm font-bold hover:bg-umbra-accent/20 transition-all"
                >
                  <Sparkles size={18} />
                  Gerando história
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {scenes.map((scene, index) => (
                <div 
                  key={scene.id}
                  className="group flex items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-umbra-accent/50 transition-all"
                >
                  <div className="text-umbra-muted cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} />
                  </div>
                  <div className="w-10 h-10 bg-umbra-accent/10 rounded-xl flex items-center justify-center text-umbra-accent font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-medium">{scene.content}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-umbra-muted hover:text-white transition-colors">
                      <Edit3 size={18} />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-umbra-muted hover:text-red-400 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              
              <button className="w-full py-6 border-2 border-dashed border-white/5 rounded-3xl text-umbra-muted hover:text-white hover:border-white/10 transition-all flex items-center justify-center gap-2 font-bold">
                <PlusCircle size={20} />
                Adicionar Nova Cena
              </button>
            </div>

            <div className="flex items-center justify-between pt-8">
              <button onClick={handleBack} className="flex items-center gap-2 text-umbra-muted hover:text-white transition-colors text-sm font-bold">
                <ChevronLeft size={18} />
                Voltar
              </button>
              <button 
                onClick={handleNext}
                className="px-12 py-4 rounded-2xl bg-umbra-accent font-bold text-white purple-glow hover:bg-umbra-accent-hover transition-all flex items-center gap-2"
              >
                Próximo
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Passo 3: Estilo e Formato</h2>
              <p className="text-umbra-muted">Escolha a proporção e o estilo.</p>
            </div>

            <div className="space-y-6">
              <label className="text-xs font-bold uppercase tracking-widest text-umbra-muted">Formato da Imagem</label>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { id: '9:16', label: '9:16', icon: Smartphone },
                  { id: '1:1', label: '1:1', icon: Square },
                  { id: '16:9', label: '16:9', icon: Monitor },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setAspectRatio(format.id)}
                    className={`flex flex-col items-center gap-4 p-8 rounded-3xl border-2 transition-all ${
                      aspectRatio === format.id 
                        ? 'bg-umbra-accent/10 border-umbra-accent text-white purple-glow' 
                        : 'bg-white/5 border-white/5 text-umbra-muted hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <format.icon size={32} />
                    <span className="font-bold">{format.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-xs font-bold uppercase tracking-widest text-umbra-muted">Estilo Visual</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`flex flex-col gap-3 p-4 rounded-2xl border transition-all text-left ${
                      selectedStyle === style.id 
                        ? 'bg-umbra-accent/10 border-umbra-accent text-white' 
                        : 'bg-white/5 border-white/5 text-umbra-muted hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <div className="aspect-square bg-white/5 rounded-xl mb-1 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                        <Palette size={24} className="opacity-20" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">{style.description}</p>
                      <p className="font-bold">{style.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-8">
              <button onClick={handleBack} className="flex items-center gap-2 text-umbra-muted hover:text-white transition-colors text-sm font-bold">
                <ChevronLeft size={18} />
                Voltar
              </button>
              <button 
                onClick={handleNext}
                className="px-12 py-4 rounded-2xl bg-umbra-accent font-bold text-white purple-glow hover:bg-umbra-accent-hover transition-all flex items-center gap-2"
              >
                Próximo
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Passo 4: Personagens</h2>
                <p className="text-umbra-muted">Configure os personagens da história.</p>
              </div>
              <button className="flex items-center gap-2 bg-umbra-accent text-white px-6 py-3 rounded-2xl font-bold purple-glow hover:bg-umbra-accent-hover transition-all">
                <PlusCircle size={20} />
                Novo personagem
              </button>
            </div>

            {/* Generation Progress */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-umbra-accent/10 rounded-xl flex items-center justify-center text-umbra-accent">
                    <Search size={24} className={characterStep < 4 ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Etapa {characterStep}/4: {characterSteps[characterStep - 1]}</h3>
                    <p className="text-sm text-umbra-muted">
                      {characters.length === 0 ? '0 de 0 personagens gerados' : `${characters.length} personagens encontrados`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-umbra-accent">0%</span>
                </div>
              </div>
              
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(characterStep / 4) * 100}%` }}
                  className="h-full bg-umbra-accent shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                />
              </div>
            </div>

            {/* Filters & List */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {['Todos', 'Humanos', 'Animais', 'Insetos'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setCharacterFilter(filter)}
                    className={`px-6 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                      characterFilter === filter 
                        ? 'bg-umbra-accent text-white' 
                        : 'bg-white/5 text-umbra-muted hover:bg-white/10'
                    }`}
                  >
                    {filter} ({filter === 'Todos' ? mockCharacters.length : mockCharacters.filter(c => c.type === filter).length})
                  </button>
                ))}
              </div>

              {mockCharacters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockCharacters.filter(c => characterFilter === 'Todos' || c.type === characterFilter).map(char => (
                    <div key={char.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-umbra-accent/20 to-transparent flex items-center justify-center">
                              <Users size={32} className="text-umbra-accent/40" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-umbra-accent bg-umbra-accent/10 px-2 py-0.5 rounded">V1</span>
                              <h4 className="font-bold text-lg">{char.name}</h4>
                            </div>
                            <p className="text-xs text-umbra-muted uppercase tracking-widest font-bold">Nome do personagem</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-umbra-muted hover:text-white">
                            <RefreshCw size={18} />
                          </button>
                          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-umbra-muted hover:text-white">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-umbra-muted">Prompt</label>
                          <button className="flex items-center gap-1.5 text-umbra-accent hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
                            <Copy size={12} /> Copiar
                          </button>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-umbra-muted relative group">
                          {char.prompt}
                          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-2 text-umbra-accent font-bold text-xs">
                              <ShieldAlert size={14} /> Somente para membros Premium
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { icon: RefreshCw, label: 'Regenerar' },
                          { icon: Layers, label: 'Variação' },
                          { icon: Wand2, label: 'Editar com IA' },
                          { icon: ImageIcon, label: 'Referência' },
                          { icon: ImageAction, label: 'Galeria' },
                          { icon: Download, label: 'Download' },
                          { icon: Trash, label: 'Excluir' },
                        ].map((action, i) => (
                          <button key={i} className="flex flex-col items-center gap-1.5 p-2 hover:bg-white/5 rounded-xl transition-all group">
                            <action.icon size={16} className="text-umbra-muted group-hover:text-umbra-accent transition-colors" />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-umbra-muted group-hover:text-white">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-umbra-muted/30">
                    <Users size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Nenhum personagem</h3>
                    <p className="text-umbra-muted">Você pode adicionar personagens manualmente ou seguir sem eles.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-8">
              <button onClick={handleBack} className="flex items-center gap-2 text-umbra-muted hover:text-white transition-colors text-sm font-bold">
                <ChevronLeft size={18} />
                Voltar
              </button>
              <button 
                onClick={handleNext}
                className="px-12 py-4 rounded-2xl bg-umbra-accent font-bold text-white purple-glow hover:bg-umbra-accent-hover transition-all flex items-center gap-2"
              >
                Próximo
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Passo 5: Elenco</h2>
                <p className="text-umbra-muted">Escolha o elenco de cada cena</p>
              </div>
              <button className="flex items-center gap-2 text-umbra-accent bg-umbra-accent/10 px-6 py-3 rounded-2xl font-bold hover:bg-umbra-accent/20 transition-all">
                <Check size={20} />
                Marcar todos
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Scene List */}
              <div className="lg:col-span-1 space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-umbra-muted">Cenas disponíveis</label>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {fullScenes.map((scene, idx) => (
                    <button
                      key={scene.id}
                      onClick={() => setSelectedSceneIndex(idx)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                        selectedSceneIndex === idx 
                          ? 'bg-umbra-accent/10 border-umbra-accent text-white' 
                          : 'bg-white/5 border-white/5 text-umbra-muted hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        selectedSceneIndex === idx ? 'bg-umbra-accent text-white' : 'bg-white/10'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="font-bold">{scene.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scene Detail & Character Selection */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{fullScenes[selectedSceneIndex].title}</h3>
                    <p className="text-xs text-umbra-muted uppercase tracking-widest font-bold">Trecho da história</p>
                    <p className="text-lg leading-relaxed">{fullScenes[selectedSceneIndex].content}</p>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-umbra-muted">Selecionar Elenco</label>
                      <div className="flex gap-2">
                        {['Todos', 'Humanos', 'Animais', 'Insetos'].map(f => (
                          <button key={f} className="text-[10px] font-bold uppercase tracking-widest text-umbra-muted hover:text-white transition-colors">
                            {f} (0)
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {mockCharacters.map(char => (
                        <button key={char.id} className="flex items-center gap-4 p-4 bg-white/5 border border-umbra-accent rounded-2xl text-left relative overflow-hidden group">
                          <div className="w-12 h-12 bg-umbra-accent/20 rounded-xl flex items-center justify-center">
                            <Users size={20} className="text-umbra-accent" />
                          </div>
                          <div>
                            <p className="font-bold">{char.name}</p>
                            <p className="text-[10px] text-umbra-muted uppercase tracking-widest font-bold">V1</p>
                          </div>
                          <div className="absolute top-2 right-2">
                            <div className="w-5 h-5 bg-umbra-accent rounded-full flex items-center justify-center">
                              <Check size={12} className="text-white" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-8">
              <div className="flex gap-4">
                <button onClick={handleBack} className="flex items-center gap-2 text-umbra-muted hover:text-white transition-colors text-sm font-bold">
                  <ChevronLeft size={18} />
                  Anterior
                </button>
                <button className="flex items-center gap-2 text-red-500/60 hover:text-red-500 transition-colors text-sm font-bold">
                  <RefreshCw size={18} />
                  Resetar Passo 5
                </button>
              </div>
              <button 
                onClick={handleNext}
                className="px-12 py-4 rounded-2xl bg-umbra-accent font-bold text-white purple-glow hover:bg-umbra-accent-hover transition-all flex items-center gap-2"
              >
                Próximo
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Passo 6: Ambientes</h2>
                <p className="text-umbra-muted">Configure o ambiente das cenas.</p>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Gerando descrições dos ambientes</h3>
                  <p className="text-sm text-umbra-muted">2 de 4 ambientes gerados</p>
                </div>
                <span className="text-2xl font-bold text-umbra-accent">50%</span>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                <motion.div animate={{ width: '50%' }} className="h-full bg-umbra-accent shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-umbra-muted">Cenas disponíveis</label>
                <div className="space-y-2">
                  {fullScenes.map((scene, idx) => (
                    <button
                      key={scene.id}
                      onClick={() => setSelectedSceneIndex(idx)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                        selectedSceneIndex === idx 
                          ? 'bg-umbra-accent/10 border-umbra-accent text-white' 
                          : 'bg-white/5 border-white/5 text-umbra-muted hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        selectedSceneIndex === idx ? 'bg-umbra-accent text-white' : 'bg-white/10'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="font-bold">{scene.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{fullScenes[selectedSceneIndex].title}</h3>
                    <p className="text-xs text-umbra-muted uppercase tracking-widest font-bold">Trecho da história</p>
                    <p className="text-lg leading-relaxed">{fullScenes[selectedSceneIndex].content}</p>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-umbra-muted">Prompt do ambiente</label>
                      <button className="flex items-center gap-1.5 text-umbra-accent hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
                        <Copy size={12} /> Copiar
                      </button>
                    </div>
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-umbra-muted relative group min-h-[100px]">
                      {fullScenes[selectedSceneIndex].prompt}
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-umbra-accent font-bold text-xs">
                          <ShieldAlert size={14} /> Somente para membros Premium
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2 pt-4">
                      {[
                        { icon: Mountain, label: 'Ambiente' },
                        { icon: RefreshCw, label: 'Refazer' },
                        { icon: Wand2, label: 'Editar com IA' },
                        { icon: Time, label: 'Horário' },
                        { icon: ImageIcon, label: 'Referência' },
                        { icon: History, label: 'Reutilizar' },
                        { icon: Download, label: 'Download' },
                      ].map((action, i) => (
                        <button key={i} className="flex flex-col items-center gap-1.5 p-2 hover:bg-white/5 rounded-xl transition-all group">
                          <action.icon size={16} className="text-umbra-muted group-hover:text-umbra-accent transition-colors" />
                          <span className="text-[8px] font-bold uppercase tracking-widest text-umbra-muted group-hover:text-white">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-8">
              <button onClick={handleBack} className="flex items-center gap-2 text-umbra-muted hover:text-white transition-colors text-sm font-bold">
                <ChevronLeft size={18} />
                Anterior
              </button>
              <button 
                onClick={handleNext}
                className="px-12 py-4 rounded-2xl bg-umbra-accent font-bold text-white purple-glow hover:bg-umbra-accent-hover transition-all flex items-center gap-2"
              >
                Próximo
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        );
      case 7:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Passo 7: Imagens</h2>
                <p className="text-umbra-muted">Edite e anime as imagens que deseja.</p>
              </div>
              <button className="flex items-center gap-2 bg-umbra-accent text-white px-6 py-3 rounded-2xl font-bold purple-glow hover:bg-umbra-accent-hover transition-all">
                <Zap size={20} />
                Animar tudo
              </button>
            </div>

            {/* Progress */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Descrevendo as ações dos personagens (4/4)</h3>
                  <p className="text-sm text-umbra-muted">4 de 4 cenas geradas</p>
                </div>
                <span className="text-2xl font-bold text-umbra-accent">100%</span>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-umbra-accent shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
              </div>
            </div>

            <div className="space-y-8">
              {fullScenes.map((scene, idx) => (
                <div key={scene.id} className="bg-white/5 border border-white/10 rounded-[40px] p-10 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-umbra-accent rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-umbra-accent/20">
                          {idx + 1}
                        </div>
                        <h3 className="text-2xl font-bold">{scene.title}</h3>
                      </div>

                      <div className="space-y-4">
                        <p className="text-xs text-umbra-muted uppercase tracking-widest font-bold">Trecho da história</p>
                        <p className="text-xl leading-relaxed text-white/90">{scene.content}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-umbra-muted uppercase tracking-widest font-bold">Prompt completo</p>
                          <button className="flex items-center gap-1.5 text-umbra-accent hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
                            <Copy size={12} /> Copiar
                          </button>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-3xl p-6 text-sm text-umbra-muted relative group min-h-[80px]">
                          {scene.prompt}
                          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-2 text-umbra-accent font-bold text-xs">
                              <ShieldAlert size={14} /> Somente para membros Premium
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {[
                          { icon: RefreshCw, label: 'Refazer' },
                          { icon: Wand2, label: 'Editar com IA' },
                          { icon: Users, label: 'Figurantes' },
                          { icon: Zap, label: 'Ações' },
                          { icon: Video, label: 'Animar' },
                          { icon: Download, label: 'Download' },
                        ].map((action, i) => (
                          <button key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group">
                            <action.icon size={16} className="text-umbra-muted group-hover:text-umbra-accent transition-colors" />
                            <span className="text-xs font-bold text-umbra-muted group-hover:text-white">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="aspect-video bg-black/40 rounded-[32px] border border-white/5 flex items-center justify-center relative overflow-hidden group">
                        <div className="w-full h-full bg-gradient-to-br from-umbra-accent/10 to-transparent flex items-center justify-center">
                          <ImageIcon size={64} className="text-umbra-accent/20" />
                        </div>
                        <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10">
                          16:9
                        </div>
                        <div className="absolute top-6 left-6 px-3 py-1 bg-umbra-accent rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg">
                          Cena {idx + 1}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(t => (
                          <button key={t} className="aspect-video bg-white/5 rounded-2xl border border-white/5 hover:border-umbra-accent/50 transition-all flex items-center justify-center group">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-umbra-muted group-hover:text-white">Thumb {t}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-8">
              <div className="flex gap-4">
                <button onClick={handleBack} className="flex items-center gap-2 text-umbra-muted hover:text-white transition-colors text-sm font-bold">
                  <ChevronLeft size={18} />
                  Anterior
                </button>
                <button className="flex items-center gap-2 text-umbra-accent hover:text-white transition-colors text-sm font-bold">
                  <RefreshCw size={18} />
                  Regenerar Passo 7
                </button>
              </div>
              <button 
                onClick={handleNext}
                className="px-12 py-4 rounded-2xl bg-umbra-accent font-bold text-white purple-glow hover:bg-umbra-accent-hover transition-all flex items-center gap-2"
              >
                Próximo
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        );
      case 8:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Passo 8: Editar vídeo</h2>
                <p className="text-umbra-muted">Finalize seu vídeo com narração, música e efeitos.</p>
              </div>
              <button 
                onClick={() => setShowExportSettings(true)}
                className="flex items-center gap-2 bg-umbra-accent text-white px-8 py-4 rounded-2xl font-bold purple-glow hover:bg-umbra-accent-hover transition-all"
              >
                <Download size={20} />
                Exportar vídeo
              </button>
            </div>

            <AnimatePresence>
              {showExportSettings && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowExportSettings(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8"
                  >
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Configurações de exportação</h3>
                      <p className="text-sm text-umbra-muted leading-relaxed">
                        Verificamos as capacidades do seu dispositivo e sugerimos configurações ideais de vídeo. Você pode usá-las ou ajustá-las manualmente.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-umbra-muted">Resolução</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['480p', '720p', '1080p'].map(res => (
                            <button
                              key={res}
                              onClick={() => setExportResolution(res)}
                              className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                                exportResolution === res 
                                  ? 'bg-umbra-accent text-white border-umbra-accent' 
                                  : 'bg-white/5 border-white/5 text-umbra-muted hover:bg-white/10'
                              }`}
                            >
                              {res}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-umbra-muted">FPS</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['24', '30', '60'].map(fps => (
                            <button
                              key={fps}
                              onClick={() => setExportFps(fps)}
                              className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                                exportFps === fps 
                                  ? 'bg-umbra-accent text-white border-umbra-accent' 
                                  : 'bg-white/5 border-white/5 text-umbra-muted hover:bg-white/10'
                              }`}
                            >
                              {fps}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        onClick={() => setShowExportSettings(false)}
                        className="flex-1 py-4 rounded-2xl bg-white/5 font-bold hover:bg-white/10 transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={() => {
                          setShowExportSettings(false);
                          setIsExporting(true);
                        }}
                        className="flex-1 py-4 rounded-2xl bg-umbra-accent font-bold text-white purple-glow hover:bg-umbra-accent-hover transition-all"
                      >
                        Exportar
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {isExporting ? (
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-20 flex flex-col items-center justify-center text-center space-y-8 min-h-[600px]">
                <div className="w-24 h-24 bg-umbra-accent/10 rounded-3xl flex items-center justify-center text-umbra-accent animate-spin">
                  <RefreshCw size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold">Carregando editor de vídeo</h3>
                  <p className="text-umbra-muted text-lg">Isso pode levar alguns segundos, estamos preparando sua timeline...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Panel: Editor Controls */}
                <div className="xl:col-span-8 space-y-8">
                  {/* Preview Area */}
                  <div className="aspect-video bg-black rounded-[40px] border border-white/5 flex items-center justify-center relative overflow-hidden group shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-br from-umbra-accent/5 to-transparent flex items-center justify-center">
                      <Play size={80} className="text-white/20 group-hover:text-umbra-accent group-hover:scale-110 transition-all cursor-pointer" />
                    </div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
                      <button className="p-3 bg-white text-black rounded-full hover:scale-105 transition-all"><Play size={24} fill="black" /></button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ChevronRight size={20} /></button>
                    </div>
                    <div className="absolute top-8 right-8 flex gap-3">
                      <button className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-xs font-bold border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
                        <Maximize2 size={14} /> Expandir
                      </button>
                    </div>
                  </div>

                  {/* Timeline Controls */}
                  <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                      <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-xs font-bold">
                          <Upload size={14} /> Upload
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-xs font-bold">
                          <Key size={14} /> Keyframes
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-xs font-bold">
                          <Monitor size={14} /> Formato
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-umbra-muted font-mono text-sm">
                        <span className="text-white">00:12</span> / 00:45
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { icon: Mic, label: 'Narração', color: 'bg-blue-500' },
                        { icon: Type, label: 'Legendas', color: 'bg-emerald-500' },
                        { icon: Scissors, label: 'Transições', color: 'bg-amber-500' },
                        { icon: Zap, label: 'Animações', color: 'bg-purple-500' },
                        { icon: Palette, label: 'Efeitos', color: 'bg-pink-500' },
                        { icon: ShieldAlert, label: 'Marca d\'água', color: 'bg-red-500' },
                        { icon: Music, label: 'Música', color: 'bg-indigo-500' },
                      ].map((track, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                          <div className="w-32 flex items-center gap-2 text-xs font-bold text-umbra-muted group-hover:text-white transition-colors">
                            <track.icon size={14} /> {track.label}
                          </div>
                          <div className="flex-1 h-8 bg-white/5 rounded-lg relative overflow-hidden">
                            <div className={`absolute left-[10%] w-[40%] h-full ${track.color}/20 border-x border-white/10 flex items-center px-2`}>
                              <div className={`w-full h-1 ${track.color} rounded-full opacity-50`} />
                            </div>
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/5 rounded flex items-center justify-center hover:bg-white/10 transition-all">
                              <PlusCircle size={14} className="text-umbra-muted" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Panel: Settings & Assets */}
                <div className="xl:col-span-4 space-y-8">
                  {/* Voice Providers */}
                  <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Mic size={20} className="text-umbra-accent" /> Narração
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Manual', 'Speechify', 'ElevenLabs', 'LMNT', 'Google IA Studio', 'DeAPI'].map(v => (
                        <button key={v} className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold hover:border-umbra-accent/50 hover:bg-umbra-accent/5 transition-all text-left">
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio per Scene */}
                  <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Music size={20} className="text-umbra-accent" /> Áudio por Cena
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {fullScenes.map((scene, idx) => (
                        <div key={scene.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                              <span className="text-xs font-bold">{scene.title}</span>
                            </div>
                            <span className="text-[10px] font-mono text-umbra-muted">{scene.duration}</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold transition-all">Gerar Áudio</button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><Settings2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-8">
              <button onClick={handleBack} className="flex items-center gap-2 text-umbra-muted hover:text-white transition-colors text-sm font-bold">
                <ChevronLeft size={18} />
                Anterior
              </button>
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-umbra-muted hover:text-white transition-colors text-sm font-bold">
                  <HelpCircle size={18} /> Como funciona
                </button>
                <button 
                  onClick={() => onComplete({})}
                  className="px-12 py-4 rounded-2xl bg-umbra-accent font-bold text-white purple-glow hover:bg-umbra-accent-hover transition-all flex items-center gap-2"
                >
                  Finalizar
                  <Check size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        );
      default: {
        const StepIcon = STEPS[currentStep - 1].icon;
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
              <StepIcon size={40} className="text-umbra-accent" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Passo {currentStep}: {STEPS[currentStep - 1].label}</h2>
            <p className="text-umbra-muted mb-8">Esta funcionalidade está sendo preparada para você.</p>
            <div className="flex gap-4">
              <button onClick={handleBack} className="px-8 py-3 rounded-xl bg-white/5 font-bold hover:bg-white/10 transition-all">Voltar</button>
              <button onClick={handleNext} className="px-8 py-3 rounded-xl bg-umbra-accent font-bold hover:bg-umbra-accent-hover transition-all">Próximo</button>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="font-bold text-lg">{projectName}</h1>
              <p className="text-xs text-umbra-muted uppercase tracking-widest font-bold">Criador de Vídeo</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-umbra-muted uppercase tracking-widest">Salvamento Automático</span>
            </div>
            <button className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all text-sm">
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="border-b border-white/5 bg-[#0a0a0a]/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div 
                  className={`flex flex-col items-center gap-2 transition-all ${
                    currentStep >= step.id ? 'text-umbra-accent' : 'text-umbra-muted'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    currentStep === step.id 
                      ? 'bg-umbra-accent text-white border-umbra-accent purple-glow' 
                      : currentStep > step.id 
                        ? 'bg-umbra-accent/10 border-umbra-accent/20 text-umbra-accent'
                        : 'bg-white/5 border-white/10 text-umbra-muted'
                  }`}>
                    {currentStep > step.id ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{step.label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-[1px] mx-4 transition-all ${
                    currentStep > step.id ? 'bg-umbra-accent/30' : 'bg-white/5'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </main>
    </div>
  );
}

function CheckCircle2({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function Loader2({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
