
import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

function extractJson(text: string | undefined) {
  if (!text) return null;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse AI JSON:", text);
    throw new Error("Invalid AI response format");
  }
}

export async function processVoiceCommand(transcript: string, role: string, context?: any) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a specialized Kirana Store AI Assistant for Bharat. 
    Current User Role: ${role}
    Transcript: "${transcript}"
    
    TASK:
    1. Extract ALL mentioned grocery items and their quantities from the transcript.
    2. Identify the user intent: 
       - 'record_sale': when the user is listing items sold.
       - 'finalize_sale': when the user wants to calculate the total, checkout, or says they are done.
       - 'stock_check': when asking about availability.
    3. Identify 'payment_mode' (CASH or UDHAAR) if mentioned.
    4. Provide a 'message' response in the same language style as the user (Hinglish, Hindi, or English).

    CRITICAL: Ensure you extract EVERY item mentioned. If the user says "Add 2kg rice and 1kg dal", the items array MUST contain both.

    Example Input: "2 kilo chawal, 5 liter tel aur ek packet namak"
    Example JSON: {
      "message": "Theek hai, chawal, tel aur namak bill mein jod diye gaye hain.",
      "items": [
        {"product": "Chawal", "qty": 2, "unit": "kg"},
        {"product": "Tel", "qty": 5, "unit": "liter"},
        {"product": "Namak", "qty": 1, "unit": "packet"}
      ],
      "intent": "record_sale"
    }`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING, description: "Conversational feedback for the user." },
          intent: { type: Type.STRING, description: "The determined user intent." },
          items: {
            type: Type.ARRAY,
            description: "A list of all items extracted from the speech.",
            items: {
              type: Type.OBJECT,
              properties: {
                product: { type: Type.STRING },
                qty: { type: Type.NUMBER },
                unit: { type: Type.STRING },
                price: { type: Type.NUMBER, description: "Estimated price if mentioned, else null." }
              },
              required: ["product"]
            }
          },
          payment_mode: { type: Type.STRING, description: "CASH or UDHAAR if specified." }
        },
        required: ["message", "intent"]
      }
    }
  });
  return extractJson(response.text);
}

export async function getLogisticsIntelligence(items: any[], vehicleCapacity: number) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Acting as a 3D Bin Packing and Routing Engine. 
    Analyze these items for load efficiency: ${JSON.stringify(items)}. 
    Vehicle Max Capacity: ${vehicleCapacity} units.
    Determine: 1. Load Factor (%) 2. Stability Score (0-100) 3. Suggested Packing Order.
    Output JSON.`,
    config: { responseMimeType: "application/json" }
  });
  return extractJson(response.text);
}

export async function optimizeDeliveryRoute(stops: any[]) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Acting as a Traveling Salesman Problem (TSP) solver.
    Optimize these stops for minimum fuel and time: ${JSON.stringify(stops)}.
    Output an array of indices representing the optimized sequence and reasons.
    Output JSON.`,
    config: { responseMimeType: "application/json" }
  });
  return extractJson(response.text);
}

export async function getMarketIntelligence(region: string, dataPoints: any[]) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze these region-wide consumption patterns for ${region}: ${JSON.stringify(dataPoints)}.
    Identify: 1. Brand Wars 2. Basket Analysis 3. Hidden Demand.
    Output JSON.`,
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
        { text: "Identify grocery item. JSON format." }
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
        { text: "Extract bill items and total. JSON format." }
      ]
    },
    config: { responseMimeType: "application/json" }
  });
  return extractJson(response.text);
}

export async function getForecastInsights(inventoryData: any[]) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this inventory using Zero-shot TimesFM logic: ${JSON.stringify(inventoryData)}. 
    Predict demand for next 7 days. Output JSON.`,
    config: { responseMimeType: "application/json" }
  });
  return extractJson(response.text);
}
