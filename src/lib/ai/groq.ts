// Groq - LLM rápido e grátis
export async function callGroq(prompt: string, apiKey: string) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw new Error(`Groq error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
