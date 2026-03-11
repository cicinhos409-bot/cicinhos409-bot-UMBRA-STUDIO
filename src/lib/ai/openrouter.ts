// OpenRouter - Multi-modelo
export async function callOpenRouter(prompt: string, apiKey: string, model: string = "auto") {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model, // "auto", "gpt-3.5-turbo", "claude-opus", etc
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenRouter error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
