// Note: In a real application, this would be a Supabase Edge Function
// For now, we're mocking it with a local API endpoint

// Mock database of user tokens (same as in start-call.ts)
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
      return res.status(400).json({
        tokensAvailable: 0,
        message: "User ID is required",
      });
    }

    // Get current tokens (with fallback to default for new users)
    let currentTokens =
      userTokens[uid] !== undefined ? userTokens[uid] : userTokens["default"];

    // Initialize tokens for new users
    if (userTokens[uid] === undefined) {
      userTokens[uid] = userTokens["default"];
    }

    // Return current token count
    return res.status(200).json({
      tokensAvailable: currentTokens,
      message: "Token count retrieved successfully",
    });
  } catch (error) {
    console.error("Error in token-count handler:", error);
    return res.status(500).json({
      tokensAvailable: 0,
      message: "Server error",
    });
  }
}
