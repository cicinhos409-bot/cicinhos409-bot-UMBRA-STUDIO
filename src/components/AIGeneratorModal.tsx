import React, { useState, useEffect } from "react";
import { Loader, Send, Image as ImageIcon, Save, Trash2 } from "lucide-react";

type AIProvider = "groq" | "google" | "openrouter" | "ollama" | "deapi" | "puter" | "pollinations";

const AI_MODELS: Record<AIProvider, string[]> = {
  groq: ["mixtral-8x7b-32768", "llama2-70b", "gemma-7b"],
  google: ["gemini-fast", "gemini-search"],
  openrouter: ["auto", "openai", "openai-fast", "claude-fast", "mistral", "deepseek", "perplexity-fast", "nova-fast", "qwen-coder", "glm", "kimi"],
  ollama: ["llama2", "mistral", "neural-chat", "orca-mini"],
  deapi: ["gpt-3.5", "claude"],
  puter: ["default"],
  pollinations: ["Pollinations", "midijourney", "openai-audio"],
};

const AIGeneratorModal: React.FC<{
  onClose: () => void;
  onGenerate: (content: string, imageUrl?: string) => void;
}> = ({ onClose, onGenerate }) => {
  const [provider, setProvider] = useState<AIProvider>("groq");
  const [model, setModel] = useState("mixtral-8x7b-32768");
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"text" | "image">("text");
  const [result, setResult] = useState("");
  const [savedKeys, setSavedKeys] = useState<Record<string, string>>({});

  // Carrega chaves salvas do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ai_api_keys");
    if (saved) {
      setSavedKeys(JSON.parse(saved));
      const key = JSON.parse(saved)[provider];
      if (key) setApiKey(key);
    }
    // Reseta modelo pro padrão quando muda o provedor
    setModel(AI_MODELS[provider][0]);
  }, [provider]);

  // Salva chave no localStorage
  const saveKey = () => {
    if (!apiKey.trim()) {
      alert("Insira uma chave válida");
      return;
    }
    const updated = { ...savedKeys, [provider]: apiKey };
    setSavedKeys(updated);
    localStorage.setItem("ai_api_keys", JSON.stringify(updated));
    alert(`Chave salva para ${provider}!`);
  };

  // Remove chave salva
  const deleteKey = () => {
    const updated = { ...savedKeys };
    delete updated[provider];
    setSavedKeys(updated);
    localStorage.setItem("ai_api_keys", JSON.stringify(updated));
    setApiKey("");
  };

  const generateContent = async () => {
    if (!prompt.trim()) {
      alert("Por favor, insira um prompt");
      return;
    }

    if (mode === "text" && provider !== "ollama" && provider !== "deapi" && !apiKey.trim()) {
      alert(`Por favor, insira uma chave de API para ${provider}`);
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "text" ? "/api/ai/generate" : "/api/ai/image";
      const body = mode === "text" 
        ? { prompt, provider, apiKey, model }
        : { prompt };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Erro: ${data.error}`);
        return;
      }

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

  const providerEndsWithFreeKeys = provider === "ollama" || provider === "deapi" || provider === "pollinations";
  const hasSavedKey = savedKeys[provider];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Adicionar Conteúdo com IA</h2>
          <p className="text-gray-600 mt-1">Use sua própria chave de API para gerar conteúdo</p>
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
                <option value="ollama">💻 Ollama (Local - Grátis)</option>
                <option value="deapi">🌐 DeAPI (Grátis)</option>
                <option value="puter">☁️ Puter</option>
              </select>
            </div>
          )}

          {/* Modelo */}
          {mode === "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {AI_MODELS[provider].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {provider === "openrouter" && "🔄 'auto' seleciona automaticamente o melhor modelo"}
                {provider === "groq" && "⚡ Mistral é o mais rápido"}
                {provider === "google" && "🔍 gemini-search é otimizado para buscas"}
                {provider === "ollama" && "💻 Certifique-se que o modelo está instalado"}
              </p>
            </div>
          )}

          {/* API Key */}
          {mode === "text" && !providerEndsWithFreeKeys && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-900 mb-2">Chave de API</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Cole sua chave de API para ${provider}...`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={saveKey}
                  title="Salvar chave no navegador (localStorage)"
                  className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  <Save size={18} />
                </button>
                {hasSavedKey && (
                  <button
                    onClick={deleteKey}
                    title="Deletar chave salva"
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {hasSavedKey ? "✅ Chave salva localmente" : "Chave não será salva - insira a cada uso"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Obtenha a chave em:<br/>
                {provider === "groq" && "https://console.groq.com/keys"}
                {provider === "google" && "https://ai.google.dev/"}
                {provider === "openrouter" && "https://openrouter.ai"}
                {provider === "puter" && "https://puter.com"}
              </p>
            </div>
          )}

          {/* Mensagem APIs Grátis */}
          {mode === "text" && providerEndsWithFreeKeys && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ <strong>{provider === "ollama" ? "Ollama" : provider === "deapi" ? "DeAPI" : "Pollinations"}</strong> é grátis!
              </p>
              {provider === "ollama" && (
                <p className="text-xs text-gray-600 mt-2">
                  Certifique-se que Ollama está rodando localmente em http://localhost:11434
                </p>
              )}
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
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{result}</p>
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
