// DeAPI - APIs grátis agregadas
export async function callDeAPI(prompt: string, model: string = "gpt-3.5") {
  try {
    const response = await fetch("https://api.deapi.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw new Error(`DeAPI error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
