
import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

function extractJson(text: string | undefined) {
  if (!text) return null;
  try {
    // LLMs often wrap JSON in markdown blocks like ```json ... ```
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse AI JSON. Raw text:", text);
    // Return a minimal safe object to prevent app crash
    return { message: "Error parsing AI response.", intent: "error", items: [] };
  }
}

export async function processVoiceCommand(transcript: string, role: string, context?: any) {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a specialized Kirana Store AI Assistant for Bharat. 
      Current User Role: ${role}
      Transcript: "${transcript}"
      
      TASK:
      1. Extract ALL mentioned grocery items and their quantities.
      2. Identify the user intent: 'record_sale', 'finalize_sale', 'stock_check'.
      3. Identify 'payment_mode' (CASH or UDHAAR).
      4. Provide a 'message' response in same language style as user (Hinglish/Hindi/English).

      Example Output: { "message": "Ok, 2kg rice added.", "items": [{"product": "Rice", "qty": 2, "unit": "kg"}], "intent": "record_sale" }`,
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
                  unit: { type: Type.STRING },
                  price: { type: Type.NUMBER }
                },
                required: ["product"]
              }
            },
            payment_mode: { type: Type.STRING }
          },
          required: ["message", "intent"]
        }
      }
    });
    return extractJson(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { message: "Connectivity issue. Please try again.", intent: "error", items: [] };
  }
}

export async function getLogisticsIntelligence(items: any[], vehicleCapacity: number) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Vehicle Capacity: ${vehicleCapacity}. Items: ${JSON.stringify(items)}. Output JSON loadFactor(0-1), stability(0-100).`,
    config: { responseMimeType: "application/json" }
  });
  return extractJson(response.text);
}

export async function optimizeDeliveryRoute(stops: any[]) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Optimize these stops sequence: ${JSON.stringify(stops)}. Output JSON array of indices.`,
    config: { responseMimeType: "application/json" }
  });
  return extractJson(response.text);
}

export async function identifyGroceryItem(base64Image: string) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Identify grocery item. Output JSON." }
      ]
    },
    config: { responseMimeType: "application/json" }
  });
  return extractJson(response.text);
}

export async function analyzeBillImage(base64Image: string) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Extract bill items. Output JSON." }
      ]
    },
    config: { responseMimeType: "application/json" }
  });
  return extractJson(response.text);
}
