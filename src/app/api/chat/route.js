import OpenAI from "openai";

// Initialize OpenAI (if API key is present)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mock responses for when there's no API key (keyword-based)
const MOCK_RESPONSES = [
    {
      keywords: ["hi", "hello", "hey", "welcome", "how are you"],
      response: "Hi! Welcome to Egypt Guide! I'm here to help with anything about travel in Egypt! Ask me about pyramids, hotels, restaurants, or any destination you want!"
    },
    {
      keywords: ["pyramids", "giza", "sphinx", "ancient", "pyramid"],
      response: "The Pyramids of Giza are one of the Seven Wonders of the Ancient World! Don't miss the Great Sphinx and nearby temples, and enjoy a camel or horse ride in the desert!"
    },
    {
      keywords: ["how", "how to", "way", "go", "get there"],
      response: "You can get to the Pyramids by taxi, Uber, or via Cairo Metro to Giza, or book a full tour with a guide!"
    },
    {
      keywords: ["best restaurant giza", "restaurant in giza", "giza restaurant"],
      response: "Great restaurants in Giza: Felfela Giza, Sequoia, Kareem's, and Blue Elephant! All serving delicious Egyptian food!"
    },
    {
      keywords: ["best restaurant cairo", "restaurant in cairo", "cairo restaurant"],
      response: "Great restaurants in Cairo: Koshary Abou El Rahma, Molokhia Abdallah, Felfela, and Kareem's!"
    },
    {
      keywords: ["hurghada", "sea", "diving", "sharm", "sinai", "dahab", "beach", "coral"],
      response: "Hurghada is perfect for diving and beach trips! The Red Sea has amazing coral reefs and beautiful seaside promenades!"
    },
    {
      keywords: ["luxor", "aswan", "karnak", "nile", "felucca", "temple"],
      response: "Luxor and Aswan are incredible! Visit Karnak Temple, take a felucca ride on the Nile, and see the Aswan Dam!"
    },
    {
      keywords: ["food", "koshari", "molokhia", "ful", "ta'ameya", "restaurant", "eat"],
      response: "Egyptian food is so delicious! Try koshari, ful medames, molokhia, and ta'ameya! The restaurants on Khaled bin El Walid in Cairo are amazing!"
    },
    {
      keywords: ["hotel", "suggest", "stay", "where to stay", "accommodation"],
      response: "Great hotels: Mena House (Giza), Nile Ritz-Carlton (Cairo), Four Seasons Cairo, and Sofitel Legend Old Cataract (Aswan)!"
    },
    {
      keywords: ["when", "best time", "visit", "weather", "month", "season"],
      response: "The best time to visit Egypt is from September to April! The weather is mild and perfect for sightseeing and outdoor activities!"
    },
    {
      keywords: ["alexandria", "coast", "library", "citadel", "beach"],
      response: "Alexandria is beautiful! Visit the Bibliotheca Alexandrina, Qaitbay Citadel, and the Corniche!"
    },
    {
      keywords: ["cairo", "tahrir", "museum", "egyptian museum"],
      response: "Cairo is the heart of Egypt! Check out Tahrir Square, the Egyptian Museum, and Saladin Citadel!"
    },
    {
      keywords: ["people", "friendly", "hospitable"],
      response: "Egyptians are incredibly friendly and hospitable! You'll feel very welcome!"
    },
    {
      keywords: ["visa", "passport", "entry", "travel documents"],
      response: "Visas for Egypt are available at the airport for many nationalities!"
    },
  ];

// Helper function to find a matching mock response
function getMockResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  const responses = MOCK_RESPONSES;
  
  // Check each response for matching keywords
  for (const item of responses) {
    for (const keyword of item.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return item.response;
      }
    }
  }
  
  // If no match, return a default response
  const defaultResponses = [
    "Hi! I'm here to help with any questions about travel in Egypt! What would you like to know?",
    "Egypt is wonderful! What would you like to know about traveling here?",
    "How can I help you plan your trip to Egypt?"
  ];
      
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages = [] } = body;

    // Get last user message for mock response
    const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content || "";

    const HAS_API_KEY = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-");

    // If no API key, use mock responses
    if (!HAS_API_KEY) {
      const response = getMockResponse(lastUserMessage);
      console.log("🤖 Using mock response (no API key set)");
      return new Response(JSON.stringify({ response }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // System prompt to make the chatbot an expert on Egypt travel
    const systemPrompt = `You are a very friendly, knowledgeable Egyptian travel guide named "Egypt Guide". Your mission is to help users discover the beauty of Egypt and plan their perfect trips.
Always respond in English. Be warm, detailed, and helpful in every reply.
You can answer questions about:
- Best tourist destinations in Egypt (Pyramids, Luxor, Aswan, Sharm El-Sheikh, Hurghada, Dahab, Siwa, Alexandria, and more)
- Best hotels and restaurants in each city
- Tourist activities (sea trips, diving, desert safaris, visiting ancient monuments)
- Trip planning tips (best time to visit, budget, packing list)
- Egyptian history and culture
If you don't know an answer, say so honestly and suggest how the user can find more information.`;

    // Combine system prompt with user messages
    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    try {
      console.log("🤖 Calling OpenAI API...");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: fullMessages,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      console.log("✅ OpenAI response received!");

      return new Response(JSON.stringify({ response }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (openaiError) {
      console.warn("⚠️ OpenAI API failed, using mock responses instead!");
      console.warn("Error details:", openaiError.message);
      const response = getMockResponse(lastUserMessage);
      return new Response(JSON.stringify({ response }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("❌ Chat API error:", error);
    return new Response(JSON.stringify({ error: "Sorry, an error occurred. Please try again later." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
