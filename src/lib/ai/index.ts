// Serviço central de IA
import { callGroq } from "./groq";
import { callGoogleAI } from "./google";
import { callOpenRouter } from "./openrouter";
import { generateImagePollinations } from "./pollinations";
import { callOllama } from "./ollama";
import { callDeAPI } from "./deapi";
import { callPuter } from "./puter";

export type AIProvider = "groq" | "google" | "openrouter" | "ollama" | "deapi" | "puter" | "pollinations";

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  ollamaUrl?: string;
  model?: string;
}

export class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async generateText(prompt: string): Promise<string> {
    switch (this.config.provider) {
      case "groq":
        if (!this.config.apiKey) throw new Error("Groq API key required");
        return callGroq(prompt, this.config.apiKey);
      
      case "google":
        if (!this.config.apiKey) throw new Error("Google API key required");
        return callGoogleAI(prompt, this.config.apiKey);
      
      case "openrouter":
        if (!this.config.apiKey) throw new Error("OpenRouter API key required");
        return callOpenRouter(prompt, this.config.apiKey, this.config.model);
      
      case "ollama":
        return callOllama(prompt, this.config.ollamaUrl, this.config.model);
      
      case "deapi":
        return callDeAPI(prompt, this.config.model);
      
      case "puter":
        if (!this.config.apiKey) throw new Error("Puter API key required");
        return callPuter(prompt, this.config.apiKey);
      
      default:
        throw new Error(`Unknown provider: ${this.config.provider}`);
    }
  }

  async generateImage(prompt: string): Promise<string> {
    switch (this.config.provider) {
      case "pollinations":
        return generateImagePollinations(prompt);
      
      default:
        throw new Error(`Provider ${this.config.provider} does not support image generation`);
    }
  }
}

export default AIService;
