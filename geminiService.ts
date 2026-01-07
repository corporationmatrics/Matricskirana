
import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Robustly extracts JSON from potentially messy AI text output.
 * Handles markdown blocks and trailing text.
 */
function extractJson(text: string | undefined) {
  if (!text) return null;
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("AI JSON parse warning. Fallback to basic extraction.", e);
    // Attempt to find any object-like structure if direct parse fails
    const fallbackMatch = text.match(/\{.*\}/s);
    if (fallbackMatch) {
      try { return JSON.parse(fallbackMatch[0]); } catch { return null; }
    }
    return null;
  }
}

export async function processVoiceCommand(transcript: string, role: string) {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a Kirana Store AI assistant. 
      Extract intent and items from: "${transcript}"
      Role context: ${role}
      
      Output ONLY valid JSON:
      {
        "message": "Confirmation in simple ${transcript.match(/[\u0900-\u097F]/) ? 'Hindi' : 'English'}",
        "intent": "record_sale" | "finalize_sale" | "stock_check",
        "items": [
          { "product": "Standard Name", "qty": number, "unit": "kg/pcs/pkt" }
        ]
      }`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            intent: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  product: { type: Type.STRING },
                  qty: { type: Type.NUMBER },
                  unit: { type: Type.STRING }
                },
                required: ["product"]
              }
            }
          },
          required: ["message", "intent"]
        }
      }
    });
    return extractJson(response.text);
  } catch (error) {
    console.error("Gemini Voice Process Error:", error);
    return { message: "Connectivity issue. Try again.", intent: "error", items: [] };
  }
}

export async function optimizeDeliveryRoute(stops: any[]) {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform TSP optimization on these stops: ${JSON.stringify(stops)}. Return an array of indices in optimal order.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.NUMBER }
        }
      }
    });
    return extractJson(response.text);
  } catch (error) {
    console.error("Gemini Route Error:", error);
    return stops.map((_, i) => i); // Fallback to original order
  }
}

export async function identifyGroceryItem(base64Image: string) {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Identify this grocery item. Return JSON: { \"product\": \"name\", \"category\": \"cat\" }" }
        ]
      },
      config: { responseMimeType: "application/json" }
    });
    return extractJson(response.text);
  } catch (error) {
    return null;
  }
}

export async function analyzeBillImage(base64Image: string) {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Extract bill items. Return JSON array of { \"product\": \"name\", \"qty\": 1, \"price\": 0 }" }
        ]
      },
      config: { responseMimeType: "application/json" }
    });
    return extractJson(response.text);
  } catch (error) {
    return null;
  }
}
