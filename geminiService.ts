
import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

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
    console.error("Failed to parse AI JSON. Raw text:", text);
    return { message: "Error parsing AI response.", intent: "error", items: [] };
  }
}

export async function processVoiceCommand(transcript: string, role: string, context?: any) {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a Kirana Store AI. Extract grocery items and user intent.
      Role: ${role}
      Transcript: "${transcript}"
      
      INTENTS:
      - 'record_sale': Adding items to current bill (e.g., "Add 2kg sugar", "Ek packet Maggi")
      - 'finalize_sale': Checkout/Confirm bill (e.g., "Bas itna hi", "Bill banao", "Finalize")
      - 'stock_check': Check availability (e.g., "Dhara tel hai kya?")

      OUTPUT FORMAT (JSON):
      {
        "message": "Friendly confirmation in user's language style",
        "intent": "record_sale" | "finalize_sale" | "stock_check",
        "items": [
          { "product": "Standard Product Name", "qty": number, "unit": "kg/pcs/pkt", "price": number_if_mentioned }
        ],
        "payment_mode": "CASH" | "UDHAAR"
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
