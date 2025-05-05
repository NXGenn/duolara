"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

// Define the Interview type (merge of both interfaces)
interface Interview {
  id: string;
  type: string;
  role?: string;
  techstack?: string;
  date?: string;
  score?: number;
  description?: string;
  createdAt?: Date;
}

function HeroSection() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#1a1a2e] my-8">
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, #ff7a00 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, #3b82f6 0%, transparent 50%)",
            "radial-gradient(circle at 0% 100%, #ff7a00 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 md:pr-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-white to-blue-400">
              Master Your Interview Game
            </h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Get real-time AI feedback on your responses and improve your
              interview skills with personalized coaching.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white px-8 py-6 rounded-xl text-lg font-medium shadow-xl"
                asChild
              >
                <Link href="/interview">Start Free Practice</Link>
              </Button>
            </motion.div>

            <div className="flex items-center gap-6 mt-8">
              {[
                { count: "10K+", label: "Users" },
                { count: "95%", label: "Success Rate" },
                { count: "24/7", label: "AI Support" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-white">
                    {stat.count}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="md:w-1/2 mt-12 md:mt-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <Image
              src="/robot.png"
              alt="AI Interview Assistant"
              width={600}
              height={600}
              className="rounded-xl shadow-2xl"
            />

            {[
              {
                text: "Great Answer!",
                class: "top-4 right-4 bg-green-500/20 text-green-400",
              },
              {
                text: "Speaking Rate: Perfect",
                class: "bottom-20 -left-4 bg-blue-500/20 text-blue-400",
              },
              {
                text: "Body Language: Confident",
                class: "top-20 -right-4 bg-orange-500/20 text-orange-400",
              },
            ].map((badge, index) => (
              <motion.div
                key={index}
                className={`floating-badge backdrop-blur-md ${badge.class}`}
                animate={{
                  y: [0, -8, 0],
                  rotate: [-1, 1, -1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.4,
                }}
              >
                {badge.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InterviewCard({
  interview,
  isPast = false,
}: {
  interview: Interview;
  isPast?: boolean;
}) {
  // Format the date if available (from createdAt)
  const formattedDate =
    interview.date ||
    (interview.createdAt
      ? new Date(interview.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null);

  // Determine the display name based on available properties
  const displayName = interview.type || interview.role || "Interview";

  return (
    <motion.div className="interview-card" whileHover={{ y: -4 }}>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-blue-500/20 flex items-center justify-center">
            <span className="text-2xl bg-clip-text text-transparent bg-gradient-to-br from-orange-400 to-blue-400">
              {displayName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{displayName}</h3>
            {isPast && formattedDate && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-400">{formattedDate}</span>
                {interview.score && (
                  <span className="text-sm text-green-400">
                    {interview.score}/100
                  </span>
                )}
                {interview.techstack && (
                  <span className="text-sm text-blue-400">
                    {interview.techstack}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-6 line-clamp-2">
          {interview.description ||
            (interview.techstack
              ? `Interview focusing on ${interview.techstack}`
              : "Practice interview session")}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-75" />
          </div>

          <Button
            variant="ghost"
            className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 hover:from-orange-500/30 hover:to-blue-500/30 text-white"
            asChild
          >
            <Link href={`/interview/${interview.id}`}>
              {isPast ? "View Details" : "Start Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [userInterviews, setUserInterviews] = useState<Interview[]>([]);
  const [allInterviews, setAllInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        if (userData?.id) {
          const [userInterviewsData, allInterviewsData] = await Promise.all([
            getInterviewsByUserId(userData.id),
            getLatestInterviews({ userId: userData.id }),
          ]);

          setUserInterviews(userInterviewsData || []);
          setAllInterviews(allInterviewsData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const hasPastInterviews = userInterviews.length > 0;
  const hasUpcomingInterviews = allInterviews.length > 0;

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <HeroSection />

        <section className="py-12">
          <h2 className="text-2xl font-bold mb-8 text-white">
            Your Past Interviews
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <p>Loading your interviews...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasPastInterviews ? (
                userInterviews.map((interview, index) => (
                  <motion.div
                    key={interview.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <InterviewCard interview={interview} isPast={true} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-400">
                    You haven&apos;t taken any interviews yet
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="py-12">
          <h2 className="text-2xl font-bold mb-8 text-white">
            Pick Your Interview
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <p>Loading available interviews...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasUpcomingInterviews ? (
                allInterviews.map((interview, index) => (
                  <motion.div
                    key={interview.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <InterviewCard interview={interview} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-400">
                    There are no interviews available
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
