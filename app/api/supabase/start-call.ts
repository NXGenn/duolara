// Note: In a real application, this would be a Supabase Edge Function
// For now, we're mocking it with a local API endpoint

// Mock database of user tokens
const userTokens: Record<string, number> = {
  // Prepopulate with some test users
  "test-user-1": 5,
  "test-user-2": 0,
  // Default for new users
  default: 3,
};

export default function handler(req: any, res: any) {
  // Check method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { uid } = req.body;

    if (!uid) {
      return res
        .status(400)
        .json({ allowed: false, message: "User ID is required" });
    }

    // Get current tokens (with fallback to default)
    let currentTokens =
      userTokens[uid] !== undefined ? userTokens[uid] : userTokens["default"];

    // Check if enough tokens
    if (currentTokens <= 0) {
      return res.status(200).json({
        allowed: false,
        tokensAvailable: 0,
        message: "Out of tokens! Please upgrade.",
      });
    }

    // Decrement token
    currentTokens -= 1;
    userTokens[uid] = currentTokens;

    // Return success response
    return res.status(200).json({
      allowed: true,
      tokensAvailable: currentTokens,
      message: "Token used successfully",
    });
  } catch (error) {
    console.error("Error in start-call handler:", error);
    return res.status(500).json({ allowed: false, message: "Server error" });
  }
}
