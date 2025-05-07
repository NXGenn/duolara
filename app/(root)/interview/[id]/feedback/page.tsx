import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  // Function to determine score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success-100";
    if (score >= 60) return "text-primary-200";
    return "text-destructive-100";
  };

  // Function to determine progress color
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-success-100";
    if (score >= 60) return "bg-primary-200";
    return "bg-destructive-100";
  };

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center mb-6">
        <h1 className="text-4xl text-white font-semibold">
          Feedback Summary -{" "}
          <span className="capitalize text-primary-100">{interview.role}</span>{" "}
          Interview
        </h1>
      </div>

      {/* Summary Stats */}
      <div className="card-border w-full mb-8">
        <div className="card p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Overall Impression */}
            <div className="flex flex-row gap-4 items-center">
              <div className="blue-gradient rounded-full p-3">
                <Image src="/star.svg" width={24} height={24} alt="star" />
              </div>
              <div>
                <p className="text-light-400">Overall Impression</p>
                <p className="text-xl font-bold">
                  <span className={getScoreColor(feedback?.totalScore || 0)}>
                    {feedback?.totalScore || 0}
                  </span>
                  <span className="text-light-400">/100</span>
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-row gap-4 items-center">
              <div className="blue-gradient rounded-full p-3">
                <Image
                  src="/calendar.svg"
                  width={24}
                  height={24}
                  alt="calendar"
                />
              </div>
              <div>
                <p className="text-light-400">Interview Date</p>
                <p>
                  {feedback?.createdAt
                    ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Assessment */}
      <div className="card-border w-full mb-8">
        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Final Assessment
          </h2>
          <p className="text-lg">
            {feedback?.finalAssessment || "No assessment available"}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <h2 className="text-2xl font-semibold text-white mb-4">
        Interview Breakdown
      </h2>
      <div className="flex flex-col gap-4 mb-8">
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index} className="card-border w-full">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-white">
                  {category.name}
                </h3>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-dark-200">
                  <span className={getScoreColor(category.score)}>
                    {category.score}
                  </span>
                  <span className="text-light-400">/100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-dark-200 h-2 rounded-full mb-4">
                <div
                  className={`${getProgressColor(
                    category.score
                  )} h-full rounded-full`}
                  style={{ width: `${category.score}%` }}
                ></div>
              </div>

              {/* Detailed Feedback */}
              <p className="text-lg">{category.comment}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Strengths */}
        <div className="card-border w-full">
          <div className="blue-gradient-dark p-6 rounded-2xl h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-success-100 rounded-full p-1">
                <Image
                  src="/check.svg"
                  width={20}
                  height={20}
                  alt="Strengths"
                />
              </div>
              <h3 className="text-xl font-semibold text-white">Strengths</h3>
            </div>

            {feedback?.strengths && feedback.strengths.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            ) : (
              <p className="text-light-400">No strengths recorded</p>
            )}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="card-border w-full">
          <div className="blue-gradient-dark p-6 rounded-2xl h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-200 rounded-full p-1">
                <Image
                  src="/arrow-up.svg"
                  width={20}
                  height={20}
                  alt="Improvements"
                />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Areas for Improvement
              </h3>
            </div>

            {feedback?.areasForImprovement &&
            feedback.areasForImprovement.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {feedback.areasForImprovement.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            ) : (
              <p className="text-light-400">
                No areas for improvement recorded
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="buttons">
        <Button className="btn-secondary">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/dashboard.svg"
              width={20}
              height={20}
              alt="Dashboard"
            />
            <span>Back to Dashboard</span>
          </Link>
        </Button>

        <Button className="btn-primary">
          <Link href={`/interview/${id}`} className="flex items-center gap-2">
            <Image src="/retry.svg" width={20} height={20} alt="Retry" />
            <span>Retake Interview</span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
