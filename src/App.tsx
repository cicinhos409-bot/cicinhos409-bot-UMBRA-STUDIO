import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Video, 
  Settings, 
  ChevronRight, 
  Play, 
  Image as ImageIcon, 
  Mic, 
  Trash2, 
  Save,
  ArrowLeft,
  Loader2,
  Sparkles,
  Monitor,
  Smartphone,
  Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Scene, Character, Environment } from './types';
import { analyzeScript, generateSceneImage, generateNarration } from './lib/gemini';
import SettingsView from './components/SettingsView';
import VideoCreator from './components/VideoCreator';
import PlansView from './components/PlansView';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import BackupManager from './components/BackupManager';

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-umbra-accent text-white purple-glow' 
        : 'text-umbra-muted hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

export default function App() {
  // Recupera view salva ou usa 'landing' como padrão
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'editor' | 'settings' | 'creator' | 'plans' | 'projects'>(() => {
    const saved = localStorage.getItem('umbra_current_view');
    return (saved as any) || 'landing';
  });
  
  // Salva view sempre que mudar
  useEffect(() => {
    localStorage.setItem('umbra_current_view', view);
  }, [view]);

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(() => {
    const saved = localStorage.getItem('umbra_current_project');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Salva projeto atual sempre que mudar
  useEffect(() => {
    if (currentProject) {
      localStorage.setItem('umbra_current_project', JSON.stringify(currentProject));
    } else {
      localStorage.removeItem('umbra_current_project');
    }
  }, [currentProject]);

  const [isCreating, setIsCreating] = useState(false);
  const [creationStep, setCreationStep] = useState<'mode' | 'form'>('mode');
  const [generationMode, setGenerationMode] = useState<'auto' | 'manual'>('auto');
  const [loading, setLoading] = useState(false);

  // New Project Form
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectScript, setNewProjectScript] = useState('');
  const [newProjectStyle, setNewProjectStyle] = useState('cinematic');
  const [newProjectAspectRatio, setNewProjectAspectRatio] = useState('9:16');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
  };

  const handleImportProjects = async (importedProjects: Project[]) => {
    try {
      // Importa cada projeto para o banco de dados
      for (const project of importedProjects) {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: project.id || Math.random().toString(36).substring(7),
            name: project.name,
            script: project.script,
            style: project.style,
            aspect_ratio: project.aspect_ratio
          })
        });
      }
      
      // Recarrega projetos
      fetchProjects();
      alert(`✅ ${importedProjects.length} projeto(s) importado(s) com sucesso!`);
    } catch (error) {
      alert(`❌ Erro ao importar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setCreationStep('mode');
    setNewProjectName('');
    setNewProjectScript('');
  };

  const handleCreateProject = async () => {
    if (generationMode === 'manual') {
      setIsCreating(false);
      setView('creator');
      return;
    }

    setLoading(true);
    const id = Math.random().toString(36).substring(7);
    
    // 1. Save Project
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name: newProjectName,
        script: newProjectScript,
        style: newProjectStyle,
        aspect_ratio: newProjectAspectRatio
      })
    });

    // 2. Analyze Script with AI
    try {
      const analysis = await analyzeScript(newProjectScript);
      
      // Save Scenes
      for (let i = 0; i < analysis.scenes.length; i++) {
        const scene = analysis.scenes[i];
        const sceneId = Math.random().toString(36).substring(7);
        
        // If automatic, we could also trigger image generation here
        let imageUrl = undefined;
        if (generationMode === 'auto') {
          // In a real app, we'd queue this, but for the demo we'll just mark it for generation
        }

        await fetch('/api/scenes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: sceneId,
            project_id: id,
            content: scene.content,
            order_index: i
          })
        });
      }
    } catch (error) {
      console.error("AI Analysis failed", error);
    }

    setLoading(false);
    resetForm();
    fetchProjects();
    openProject(id);
  };

  const openProject = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`);
    const data = await res.json();
    setCurrentProject(data);
    setView('editor');
  };

  const generateImageForScene = async (sceneId: string, description: string) => {
    if (!currentProject) return;
    setLoading(true);
    try {
      const imageUrl = await generateSceneImage(description, currentProject.style, currentProject.aspect_ratio);
      if (imageUrl) {
        await fetch(`/api/scenes/${sceneId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: imageUrl })
        });
        openProject(currentProject.id);
      }
    } catch (error) {
      console.error("Image generation failed", error);
    }
    setLoading(false);
  };

  if (view === 'landing') {
    return (
      <LandingPage 
        onStart={() => {
          setAuthMode('signup');
          setView('auth');
        }}
        onLogin={() => {
          setAuthMode('login');
          setView('auth');
        }}
      />
    );
  }

  if (view === 'auth') {
    return (
      <AuthPage 
        initialMode={authMode}
        onBack={() => setView('landing')}
        onSuccess={() => setView('dashboard')}
      />
    );
  }

  if (view === 'settings') {
    return <SettingsView onBack={() => setView('dashboard')} />;
  }

  if (view === 'plans') {
    return <PlansView onBack={() => setView('dashboard')} />;
  }

  if (view === 'creator') {
    return (
      <VideoCreator 
        projectName={newProjectName}
        onCancel={() => setView('dashboard')}
        onComplete={() => {
          setView('dashboard');
          fetchProjects();
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-umbra-bg overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-umbra-border p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-umbra-accent rounded-xl flex items-center justify-center purple-glow">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">UMBRA STUDIO</h1>
        </div>

        <nav className="flex flex-col gap-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')}
          />
          <SidebarItem 
            icon={Video} 
            label="Projetos" 
            active={view === 'projects'}
            onClick={() => setView('projects')}
          />
          <SidebarItem 
            icon={Settings} 
            label="Configurações" 
            active={view === 'settings'}
            onClick={() => setView('settings')}
          />
          <SidebarItem 
            icon={Sparkles} 
            label="Planos" 
            active={view === 'plans'}
            onClick={() => setView('plans')}
          />
        </nav>

        <div className="mt-auto">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-xs text-umbra-muted mb-2 uppercase tracking-widest font-bold">Plano Grátis</p>
            <p className="text-sm font-medium mb-3">Upgrade para vídeos ilimitados.</p>
            <button 
              onClick={() => setView('plans')}
              className="w-full py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              Upgrade
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-10"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Bem-vindo, Criador</h2>
                  <p className="text-umbra-muted">Seus projetos recentes e ferramentas de criação.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-umbra-accent rounded-xl font-bold purple-glow hover:bg-umbra-accent-hover transition-all"
                  >
                    <Plus size={20} />
                    Novo Projeto
                  </button>
                  <BackupManager projects={projects} onImport={handleImportProjects} onExport={() => {}} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 3).map(project => (
                  <motion.div
                    key={project.id}
                    whileHover={{ y: -5 }}
                    onClick={() => openProject(project.id)}
                    className="p-6 rounded-2xl bg-umbra-card border border-umbra-border hover:border-umbra-accent/50 cursor-pointer transition-all group"
                  >
                    <div className="w-full aspect-video bg-black/40 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-xs font-bold uppercase tracking-widest">Abrir Editor</span>
                      </div>
                      <Video className="text-umbra-accent/20" size={48} />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{project.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-umbra-muted">{new Date(project.created_at).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold uppercase">{project.aspect_ratio}</span>
                        <span className="px-2 py-1 rounded bg-umbra-accent/20 text-umbra-accent text-[10px] font-bold uppercase">{project.style}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {projects.length > 3 && (
                <button 
                  onClick={() => setView('projects')}
                  className="mt-8 text-umbra-accent font-bold text-sm hover:underline flex items-center gap-2"
                >
                  Ver todos os projetos <ChevronRight size={16} />
                </button>
              )}
            </motion.div>
          )}

          {view === 'projects' && (
            <motion.div 
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-10"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Meus Projetos</h2>
                  <p className="text-umbra-muted">Gerencie todos os seus storyboards e vídeos.</p>
                </div>
                <button 
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-umbra-accent rounded-xl font-bold purple-glow hover:bg-umbra-accent-hover transition-all"
                >
                  <Plus size={20} />
                  Novo Projeto
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <Video size={48} className="text-white/10 mb-4" />
                  <p className="text-umbra-muted font-medium">Você ainda não criou nenhum projeto.</p>
                  <button 
                    onClick={() => setIsCreating(true)}
                    className="mt-4 text-umbra-accent font-bold hover:underline"
                  >
                    Começar agora
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(project => (
                    <motion.div
                      key={project.id}
                      whileHover={{ y: -5 }}
                      onClick={() => openProject(project.id)}
                      className="p-6 rounded-2xl bg-umbra-card border border-umbra-border hover:border-umbra-accent/50 cursor-pointer transition-all group"
                    >
                      <div className="w-full aspect-video bg-black/40 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-xs font-bold uppercase tracking-widest">Abrir Editor</span>
                        </div>
                        <Video className="text-umbra-accent/20" size={48} />
                      </div>
                      <h3 className="text-lg font-bold mb-1">{project.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-umbra-muted">{new Date(project.created_at).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold uppercase">{project.aspect_ratio}</span>
                          <span className="px-2 py-1 rounded bg-umbra-accent/20 text-umbra-accent text-[10px] font-bold uppercase">{project.style}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === 'editor' && (
            <motion.div 
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              {/* Editor Header */}
              <header className="px-8 py-4 border-b border-umbra-border flex items-center justify-between bg-umbra-bg/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setView('dashboard')}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="font-bold">{currentProject?.name}</h2>
                    <p className="text-xs text-umbra-muted">Editando Storyboard</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 font-bold text-sm transition-all flex items-center gap-2">
                    <Save size={16} />
                    Salvar
                  </button>
                  <button className="px-6 py-2 rounded-lg bg-umbra-accent hover:bg-umbra-accent-hover font-bold text-sm purple-glow transition-all flex items-center gap-2">
                    <Play size={16} />
                    Gerar Vídeo
                  </button>
                </div>
              </header>

              <div className="flex-1 flex overflow-hidden">
                {/* Scene List */}
                <div className="w-1/3 border-r border-umbra-border overflow-y-auto p-6 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold uppercase text-xs tracking-widest text-umbra-muted">Cenas</h3>
                    <button className="p-1 hover:bg-white/5 rounded transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  {currentProject?.scenes?.map((scene, idx) => (
                    <div 
                      key={scene.id}
                      className="p-4 rounded-xl bg-umbra-card border border-umbra-border hover:border-umbra-accent/30 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between mb-3">
                        <span className="text-[10px] font-bold text-umbra-accent uppercase">Cena {idx + 1}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <p className="text-sm text-umbra-muted line-clamp-3 mb-4">{scene.content}</p>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => generateImageForScene(scene.id, scene.content)}
                          className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-2"
                        >
                          {loading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                          Imagem
                        </button>
                        <button className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-2">
                          <Mic size={14} />
                          Voz
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preview Area */}
                <div className="flex-1 bg-black/20 p-10 flex flex-col items-center justify-center gap-8 overflow-y-auto">
                  <div className={`bg-umbra-card rounded-2xl border border-umbra-border shadow-2xl overflow-hidden relative ${
                    currentProject?.aspect_ratio === '9:16' ? 'aspect-[9/16] h-[600px]' : 
                    currentProject?.aspect_ratio === '16:9' ? 'aspect-video w-full max-w-3xl' : 'aspect-square h-[500px]'
                  }`}>
                    {/* Active Scene Preview */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon size={48} className="text-white/10" />
                    </div>
                    
                    {/* Subtitles Overlay */}
                    <div className="absolute bottom-10 left-0 right-0 px-6 text-center">
                      <p className="text-xl font-bold text-white drop-shadow-lg bg-black/40 py-2 rounded-lg backdrop-blur-sm">
                        Seu roteiro ganha vida aqui...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-4 rounded-2xl bg-umbra-card border border-umbra-border">
                    <button className="p-3 hover:bg-white/5 rounded-xl transition-colors"><ArrowLeft size={24} /></button>
                    <button className="w-16 h-16 bg-umbra-accent rounded-full flex items-center justify-center purple-glow hover:scale-105 transition-all">
                      <Play size={32} fill="white" />
                    </button>
                    <button className="p-3 hover:bg-white/5 rounded-xl transition-colors"><ChevronRight size={24} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Project Modal */}
        <AnimatePresence>
          {isCreating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCreating(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl bg-umbra-card border border-umbra-border rounded-3xl p-8 relative z-10"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key="create-project-simple"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="text-2xl font-bold mb-6">Novo Projeto</h3>
                    
                    <div className="space-y-8">
                      {/* Mode Selection */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-umbra-muted mb-4">Escolha o modo de geração</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => setGenerationMode('auto')}
                            className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                              generationMode === 'auto' 
                                ? 'border-umbra-accent bg-umbra-accent/10' 
                                : 'border-umbra-border bg-black/20 hover:border-white/10'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              generationMode === 'auto' ? 'bg-umbra-accent text-white' : 'bg-white/5 text-umbra-muted'
                            }`}>
                              <Sparkles size={20} />
                            </div>
                            <div>
                              <h4 className={`font-bold text-sm ${generationMode === 'auto' ? 'text-white' : 'text-umbra-muted'}`}>Automático</h4>
                              <p className="text-[10px] text-umbra-muted">A IA cria tudo</p>
                            </div>
                          </button>

                          <button
                            onClick={() => setGenerationMode('manual')}
                            className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                              generationMode === 'manual' 
                                ? 'border-umbra-accent bg-umbra-accent/10' 
                                : 'border-umbra-border bg-black/20 hover:border-white/10'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              generationMode === 'manual' ? 'bg-umbra-accent text-white' : 'bg-white/5 text-umbra-muted'
                            }`}>
                              <Plus size={20} />
                            </div>
                            <div>
                              <h4 className={`font-bold text-sm ${generationMode === 'manual' ? 'text-white' : 'text-umbra-muted'}`}>Manual</h4>
                              <p className="text-[10px] text-umbra-muted">Controle total</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Name Input */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-umbra-muted mb-3">Dê um nome ao seu projeto</label>
                        <input 
                          type="text" 
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          placeholder="Ex: História do Cavaleiro"
                          className="w-full bg-black/40 border border-umbra-border rounded-2xl px-5 py-4 focus:border-umbra-accent outline-none transition-all text-lg"
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button 
                          onClick={() => setIsCreating(false)}
                          className="flex-1 py-4 rounded-xl bg-white/5 font-bold hover:bg-white/10 transition-all"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={handleCreateProject}
                          disabled={loading || !newProjectName}
                          className="flex-1 py-4 rounded-xl bg-umbra-accent font-bold purple-glow hover:bg-umbra-accent-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                          Criar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
