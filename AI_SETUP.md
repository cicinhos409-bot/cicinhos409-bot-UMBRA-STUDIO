# Guia de Integração de IAs - Umbra Studio

Este projeto integra múltiplos provedores de IA para geração de texto e imagens.

## Provedores Disponíveis

### 1. **Groq** (Recomendado - Rápido e Grátis)
- **Uso:** Geração de texto LLM rápida
- **API Key:** Obtida em https://console.groq.com
- **Modelos:** mixtral-8x7b-32768, llama2, etc
- **Gratuito:** Sim (até 9.000 requisições por dia)
- **Setup:**
  ```bash
  # Obtenha a chave em https://console.groq.com/keys
  # Adicione na Vercel como GROQ_API_KEY
  ```

### 2. **Google AI (Gemini)**
- **Uso:** Geração de texto com Gemini
- **API Key:** https://ai.google.dev/
- **Gratuito:** Sim (até 60 RPM)
- **Setup:**
  ```bash
  # Vá em https://ai.google.dev/
  # Clique "Get API Key"
  # Adicione como GOOGLE_API_KEY na Vercel
  ```

### 3. **OpenRouter** (Multi-modelo)
- **Uso:** Acesso a múltiplos modelos (GPT, Claude, Llama, etc)
- **API Key:** https://openrouter.ai
- **Modelos:** auto (seleção automática), gpt-3.5-turbo, claude-opus, etc
- **Preços:** Variável por modelo
- **Setup:**
  ```bash
  # Registre em https://openrouter.ai
  # Obtenha a chave
  # Adicione como OPENROUTER_API_KEY
  ```

### 4. **Pollinations** (Geração de Imagens)
- **Uso:** Geração de imagens
- **API Key:** Não necessária (uso público)
- **Gratuito:** Sim
- **URLs Geradas:** `https://image.pollinations.ai/prompt/{seu_prompt}`
- **Setup:** Nenhum (já integrado)

### 5. **Ollama** (Local/Remoto)
- **Uso:** LLM local ou auto-hospedado
- **Modelos:** llama2, mistral, neural-chat, etc
- **Gratuito:** Sim
- **URL Padrão:** `http://localhost:11434`
- **Setup:**
  ```bash
  # Instale Ollama: https://ollama.ai
  # Execute: ollama run llama2
  # Opcionalmente, defina OLLAMA_URL na Vercel
  ```

### 6. **DeAPI** (APIs Grátis Agregadas)
- **Uso:** Agregação de APIs grátis
- **Modelos:** gpt-3.5, etc
- **Gratuito:** Sim
- **Setup:** Nenhum (já integrado, sem API key necessária)

### 7. **Puter** (Plataforma Cloud)
- **Uso:** Geração de conteúdo via Puter
- **API Key:** https://puter.com
- **Setup:**
  ```bash
  # Registre em https://puter.com
  # Obtenha API key
  # Adicione como PUTER_API_KEY
  ```

---

## Configuração no Projeto

### Adicionar no `.env.local` (Local):
```env
GROQ_API_KEY=seu_groq_key
GOOGLE_API_KEY=seu_google_key
OPENROUTER_API_KEY=seu_openrouter_key
PUTER_API_KEY=seu_puter_key
OLLAMA_URL=http://localhost:11434
```

### Adicionar na Vercel (Produção):
1. Vá para seu projeto na Vercel
2. **Settings → Environment Variables**
3. Adicione cada uma:
   ```
   GROQ_API_KEY = (sua chave)
   GOOGLE_API_KEY = (sua chave)
   OPENROUTER_API_KEY = (sua chave)
   PUTER_API_KEY = (sua chave)
   ```

---

## Como Usar

### Via Interface (React Component)
O componente `AIGeneratorModal` está disponível em `src/components/AIGeneratorModal.tsx`:

```tsx
import AIGeneratorModal from './components/AIGeneratorModal';

// No seu componente:
<AIGeneratorModal 
  onClose={() => setShowAI(false)}
  onGenerate={(text, image) => {
    // Use o texto ou imagem aqui
  }}
/>
```

### Via API REST

**Gerar Texto:**
```bash
POST /api/ai/generate
{
  "prompt": "Escreva um roteiro de ação",
  "provider": "groq",
  "apiKey": "opcional (use env vars)"
}
```

**Gerar Imagem:**
```bash
POST /api/ai/image
{
  "prompt": "Uma cena de ação futurista"
}
```

---

## Exemplos de Requisições

### Usando Groq (Texto):
```javascript
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Escreva um monólogo de um vilão',
    provider: 'groq'
  })
});
const { result } = await response.json();
console.log(result);
```

### Usando Pollinations (Imagem):
```javascript
const response = await fetch('/api/ai/image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Um herói em pé nas ruínas de um castelo'
  })
});
const { imageUrl } = await response.json();
```

---

## Recomendações

**Para Texto:**
1. 🥇 **Groq** - Mais rápido, grátis, suficiente para a maioria dos casos
2. 🥈 **Google AI** - Modelo mais poderoso, mas mais lento
3. 🥉 **OpenRouter** - Flexibilidade de modelos

**Para Imagens:**
- 🎨 **Pollinations** - Único integrado, grátis, bons resultados

**Para Produção:**
- Use **Ollama** localmente para privacidade
- Use **OpenRouter** para máxima flexibilidade
- Combine com **cache** para economizar requisições

---

## Troubleshooting

**"API Key Required"**
- Verifique se adicionou a chave nas environment variables

**"Connection Refused"**
- Para Ollama: certifique-se que está rodando (`ollama serve`)
- Para APIs externas: verifique conexão com internet

**"Rate Limit Exceeded"**
- Groq: máximo 9.000 req/dia (tier gratuito)
- Google: 60 RPM
- Implemente cache/fila se necessário

---

## Custo Estimado (Mensal)

| Provedor | Tier Gratuito | Pago |
|----------|---------------|------|
| Groq | 9.000 req/dia | $3-10 |
| Google AI | 60 RPM | $0.05-0.50 |
| OpenRouter | Pagamento | Variável |
| Pollinations | Ilimitado | - |
| Ollama | Ilimitado (local) | - |

---

Aproveite! 🚀
