"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { checkAndUseToken, getTokenCount } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function InterviewTokens() {
  const { user, loading: authLoading } = useAuth();
  const [tokensAvailable, setTokensAvailable] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Redirect to auth page if not authenticated and not loading
    if (!user && !authLoading) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access interview tokens",
        variant: "destructive",
      });
      router.push("/sign-in");
      return;
    }

    // Fetch token count when user is available
    const fetchTokenCount = async () => {
      if (user) {
        setIsChecking(true);
        try {
          const count = await getTokenCount(user.uid);
          setTokensAvailable(count);
        } catch (error) {
          console.error("Error fetching tokens:", error);
          toast({
            title: "Error",
            description: "Could not load your token count",
            variant: "destructive",
          });
        } finally {
          setIsChecking(false);
        }
      }
    };

    fetchTokenCount();
  }, [user, authLoading, router, toast]);

  const handleStartInterview = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start an interview.",
        variant: "destructive",
      });
      router.push("/auth");
      return;
    }

    setIsStarting(true);
    try {
      const result = await checkAndUseToken(user.uid);

      if (result.allowed) {
        // Update local token count
        if (tokensAvailable !== null) {
          setTokensAvailable(tokensAvailable - 1);
        }

        toast({
          title: "Interview Starting",
          description: "Preparing your interview session...",
          variant: "default",
        });

        // Here you would typically navigate to your interview page or start the interview process
        console.log("Interview started successfully!");

        // Mock interview start - in reality you'd navigate or show the interview interface
        setTimeout(() => {
          toast({
            title: "Interview Ready",
            description: "Your interview session is now ready!",
            variant: "default",
          });
        }, 1500);
      } else {
        toast({
          title: "Out of tokens!",
          description: "Please upgrade your plan to continue.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      toast({
        title: "Error",
        description: "Could not start the interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  // Show loading state while auth or tokens are loading
  if (authLoading || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoaderCircle className="h-12 w-12 text-interview-primary animate-spin" />
        <p className="mt-4 text-interview-text text-lg">
          Loading your interview tokens...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="bg-interview-light p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="mb-8">
          <h2 className="text-xl font-medium text-interview-text mb-2">
            Your Interview Tokens
          </h2>
          <div className="inline-flex items-center justify-center bg-black px-4 py-2 rounded-full shadow-inner">
            <span className="text-3xl font-bold text-interview-primary">
              {tokensAvailable !== null ? tokensAvailable : "–"}
            </span>
            <span className="ml-2 text-interview-text font-medium">
              Tokens Left
            </span>
          </div>
        </div>

        <Button
          className="w-full py-6 text-lg font-medium bg-amber-500 text-white transition-all"
          onClick={handleStartInterview}
          disabled={isStarting || tokensAvailable === 0}
        >
          {isStarting ? (
            <>
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              Preparing Interview...
            </>
          ) : tokensAvailable === 0 ? (
            "Out of tokens! Please upgrade."
          ) : (
            "Start Interview"
          )}
        </Button>

        {tokensAvailable === 0 && (
          <p className="mt-4 text-sm text-white text-interview-text">
            You've used all your interview tokens.
            <a
              href="/upgrade"
              className="ml-1 text-white text-interview-primary hover:underline"
            >
              Upgrade your plan
            </a>{" "}
            to continue practicing.
          </p>
        )}

        {tokensAvailable !== null &&
          tokensAvailable > 0 &&
          tokensAvailable <= 3 && (
            <p className="mt-4 text-sm text-amber-600">
              You're running low on tokens. Consider upgrading soon.
            </p>
          )}
      </div>
    </div>
  );
}
