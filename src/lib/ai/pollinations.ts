// Pollinations - Geração de imagens
export async function generateImagePollinations(prompt: string): Promise<string> {
  try {
    // Pollinations não requer autenticação para uso básico
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    return imageUrl;
  } catch (error) {
    throw new Error(`Pollinations error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
