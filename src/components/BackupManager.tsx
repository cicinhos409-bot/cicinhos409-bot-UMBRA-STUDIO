import React, { useState } from 'react';
import { Download, Upload, Trash2, Copy } from 'lucide-react';
import { Project } from '../types';

interface BackupManagerProps {
  projects: Project[];
  onImport: (projects: Project[]) => void;
  onExport: (project: Project) => void;
}

const BackupManager: React.FC<BackupManagerProps> = ({ projects, onImport, onExport }) => {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Exportar todos os projetos
  const handleExportAll = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `umbra_projects_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    alert(`✅ ${projects.length} projeto(s) exportado(s)!`);
  };

  // Exportar projeto único
  const handleExportSingle = (project: Project) => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Importar projetos
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Verifica se é um arquivo único ou múltiplo
      if (Array.isArray(data)) {
        onImport(data);
        alert(`✅ ${data.length} projeto(s) importado(s)!`);
      } else if (data.id && data.name) {
        // É um projeto único
        onImport([data]);
        alert('✅ Projeto importado com sucesso!');
      } else {
        alert('❌ Arquivo inválido. Certifique-se que é um arquivo de backup Umbra.');
      }
    } catch (error) {
      alert(`❌ Erro ao importar: ${error instanceof Error ? error.message : 'Arquivo inválido'}`);
    }

    // Reseta o input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Copiar projetos para clipboard (JSON)
  const handleCopyToClipboard = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      alert('✅ Projetos copiados para clipboard!');
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition flex items-center gap-2"
      >
        💾 Backup & Sincronização
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Gerenciar Backups</h3>

          <div className="space-y-3">
            {/* Exportar Todos */}
            <button
              onClick={handleExportAll}
              disabled={projects.length === 0}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition disabled:opacity-50"
            >
              <Download size={18} />
              <div className="text-left">
                <div className="font-medium">📥 Exportar Tudo</div>
                <div className="text-xs">Baixar {projects.length} projeto(s)</div>
              </div>
            </button>

            {/* Copiar para Clipboard */}
            <button
              onClick={handleCopyToClipboard}
              disabled={projects.length === 0}
              className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition disabled:opacity-50"
            >
              <Copy size={18} />
              <div className="text-left">
                <div className="font-medium">📋 Copiar para Clipboard</div>
                <div className="text-xs">Cole em outro lugar</div>
              </div>
            </button>

            {/* Importar */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition"
            >
              <Upload size={18} />
              <div className="text-left">
                <div className="font-medium">📤 Importar Backup</div>
                <div className="text-xs">Restaurar de arquivo JSON</div>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            {/* Projetos Individuais */}
            {projects.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-xs font-medium text-gray-600 mb-2">📦 Exportar Individually:</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleExportSingle(project)}
                      className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm text-gray-700 transition"
                    >
                      💾 {project.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-700">
            💡 <strong>Dica:</strong> Use "Exportar Tudo" no site e "Importar" no local para sincronizar!
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupManager;
