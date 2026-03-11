// Puter - Plataforma cloud com APIs
export async function callPuter(prompt: string, apiKey: string) {
  try {
    const response = await fetch("https://api.puter.com/ai/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        type: "text",
      }),
    });

    const data = await response.json();
    return data.output;
  } catch (error) {
    throw new Error(`Puter error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
