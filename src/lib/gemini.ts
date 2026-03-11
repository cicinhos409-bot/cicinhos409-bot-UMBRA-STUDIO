import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeScript = async (script: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-preview",
    contents: `Analyze this script for a short video. Extract scenes, characters, and environments.
    Script: ${script}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                visualDescription: { type: Type.STRING },
                environment: { type: Type.STRING },
                characters: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["content", "visualDescription"]
            }
          },
          characters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "description"]
            }
          },
          environments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "description"]
            }
          }
        },
        required: ["scenes", "characters", "environments"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const generateSceneImage = async (description: string, style: string, aspectRatio: string = "9:16") => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: `A high quality ${style} style image of: ${description}`,
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: "1K"
      }
    }
  });
  
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return part?.inlineData?.data ? `data:image/png;base64,${part.inlineData.data}` : null;
};

export const generateNarration = async (text: string, voice: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice === "male" ? "Fenrir" : "Kore" }
        }
      }
    }
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio ? `data:audio/mp3;base64,${base64Audio}` : null;
};
