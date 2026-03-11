import React, { useState } from "react";
import { Loader, Send, Image as ImageIcon } from "lucide-react";

type AIProvider = "groq" | "google" | "openrouter" | "ollama" | "deapi" | "puter" | "pollinations";

const AIGeneratorModal: React.FC<{
  onClose: () => void;
  onGenerate: (content: string, imageUrl?: string) => void;
}> = ({ onClose, onGenerate }) => {
  const [provider, setProvider] = useState<AIProvider>("groq");
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"text" | "image">("text");
  const [result, setResult] = useState("");

  const generateContent = async () => {
    if (!prompt.trim()) {
      alert("Por favor, insira um prompt");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "text" ? "/api/ai/generate" : "/api/ai/image";
      const body = mode === "text" 
        ? { prompt, provider, apiKey }
        : { prompt };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (mode === "text") {
        setResult(data.result);
        onGenerate(data.result);
      } else {
        setResult(data.imageUrl);
        onGenerate(prompt, data.imageUrl);
      }
    } catch (error) {
      alert(`Erro: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Adicionar Conteúdo com IA</h2>
          <p className="text-gray-600 mt-1">Escolha um provedor de IA para gerar conteúdo</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Modo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Geração</label>
            <div className="flex gap-4">
              <button
                onClick={() => setMode("text")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  mode === "text"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                📝 Texto
              </button>
              <button
                onClick={() => setMode("image")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  mode === "image"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ImageIcon className="inline mr-2" size={18} />
                Imagem
              </button>
            </div>
          </div>

          {/* Provedor */}
          {mode === "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provedor de IA</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as AIProvider)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="groq">🚀 Groq (Rápido, Grátis)</option>
                <option value="google">🔍 Google AI (Gemini)</option>
                <option value="openrouter">🎛️ OpenRouter (Multi-modelo)</option>
                <option value="ollama">💻 Ollama (Local)</option>
                <option value="deapi">🌐 DeAPI</option>
                <option value="puter">☁️ Puter</option>
              </select>
            </div>
          )}

          {/* API Key */}
          {mode === "text" && provider !== "ollama" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Insira sua chave de API para ${provider}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Sua chave não será salva, apenas usada para esta geração
              </p>
            </div>
          )}

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === "text" ? "Script/Roteiro" : "Descrição da Imagem"}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === "text" 
                ? "Descreva o roteiro/script que deseja..."
                : "Descreva a imagem que quer gerar..."
              }
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Resultado */}
          {result && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Resultado:</p>
              {mode === "text" ? (
                <p className="text-gray-700 text-sm">{result}</p>
              ) : (
                <img src={result} alt="Generated" className="max-w-full rounded-lg" />
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
          >
            Cancelar
          </button>
          <button
            onClick={generateContent}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Send size={18} />
                Gerar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratorModal;
