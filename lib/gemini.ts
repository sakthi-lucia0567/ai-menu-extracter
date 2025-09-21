import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function extractMenuFromText(text: string) {
  try {
    const limitedText =
      text.length > 8000 ? text.substring(0, 8000) + "..." : text;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Analyze the following text and extract ALL menu items with their details. 
    The text may contain conversations, descriptions, or raw menu data from restaurants, cafes, or food establishments.

    TEXT TO ANALYZE:
    "${limitedText}"

    Extract ALL menu items and return ONLY a valid JSON array without any additional text or explanations.
    Each menu item should have these fields:
    - name: string (the dish or item name)
    - description: string (brief description, omit if not available)
    - price: number (numeric price, omit if not available)
    - category: string (appetizer, main course, dessert, drink, etc.)
    - confidence: number (your confidence in this extraction 0-1)

    IMPORTANT: Return ONLY valid JSON. No other text. If no menu items are found, return an empty array [].

    Example output format:
    [
      {
        "name": "Margherita Pizza",
        "description": "Classic pizza with tomato sauce and mozzarella",
        "price": 12.99,
        "category": "Main Course",
        "confidence": 0.95
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    const cleanResponse = textResponse
      .replace(/```json\n?|\n?```/g, "")
      .replace(/^[^{[]*|[^}\]]*$/g, "")
      .trim();

    console.log("Raw Gemini response:", textResponse);
    console.log("Cleaned response:", cleanResponse);

    try {
      const menuItems = JSON.parse(cleanResponse);
      return Array.isArray(menuItems) ? menuItems : [];
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", cleanResponse);
      console.error("Parse error:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to process menu extraction");
  }
}
