import { supabase } from "@/app/integrations/supabase/client";

export interface TokenResponse {
  allowed: boolean;
  tokensAvailable?: number;
  message?: string;
  error?: string;
}

export async function checkAndUseToken(userId: string): Promise<TokenResponse> {
  try {
    const { data, error } = await supabase.functions.invoke("manage-tokens", {
      body: {
        action: "use_token",
        uid: userId,
      },
    });

    if (error) throw new Error(error.message);

    return data as TokenResponse;
  } catch (error) {
    console.error("Error calling token management function:", error);
    return {
      allowed: false,
      message:
        error instanceof Error ? error.message : "Error processing request",
    };
  }
}

export async function getTokenCount(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase.functions.invoke("manage-tokens", {
      body: {
        action: "get_count",
        uid: userId,
      },
    });

    if (error) throw new Error(error.message);

    return data?.tokensAvailable || 0;
  } catch (error) {
    console.error("Error fetching token count:", error);
    return 0;
  }
}

export async function initializeUserTokens(
  userId: string
): Promise<TokenResponse> {
  try {
    const { data, error } = await supabase.functions.invoke("manage-tokens", {
      body: {
        action: "initialize",
        uid: userId,
      },
    });

    if (error) throw new Error(error.message);

    return data as TokenResponse;
  } catch (error) {
    console.error("Error initializing user tokens:", error);
    return {
      allowed: false,
      message:
        error instanceof Error ? error.message : "Error initializing tokens",
    };
  }
}
