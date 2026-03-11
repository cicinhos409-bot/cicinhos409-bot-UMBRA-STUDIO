// Ollama - LLM local/remoto
export async function callOllama(prompt: string, ollamaUrl: string = "http://localhost:11434", model: string = "llama2") {
  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    return data.response;
  } catch (error) {
    throw new Error(`Ollama error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
