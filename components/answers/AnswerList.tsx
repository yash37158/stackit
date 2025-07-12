"use client";

import { useState } from "react";
import VoteButton from "@/components/common/VoteButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Flag, Share2 } from "lucide-react";
import type { Answer } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { useQuestionStore } from "@/stores/questionStore";
import LoginModal from "@/components/auth/LoginModal";

interface AnswerListProps {
  answers: Answer[];
  questionId: string;
  questionAuthorId: string;
}

export default function AnswerList({
  answers,
  questionId,
  questionAuthorId,
}: AnswerListProps) {
  const { user } = useAuthStore();
  const { voteOnAnswer, acceptAnswer } = useQuestionStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleVote = (answerId: string, type: "up" | "down") => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    voteOnAnswer(questionId, answerId, type, user.id);
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!user || user.id !== questionAuthorId) return;
    acceptAnswer(questionId, answerId);
  };

  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    return b.votes - a.votes;
  });

  if (answers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No answers yet. Be the first to answer!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {sortedAnswers.map((answer) => (
          <div key={answer.id} className="border-b pb-6 last:border-b-0">
            <div className="flex gap-4">
              {/* Voting */}
              <div className="flex flex-col items-center gap-2">
                <VoteButton
                  votes={answer.votes}
                  onVote={(type) => handleVote(answer.id, type)}
                  orientation="vertical"
                />

                {/* Accept Answer Button */}
                {user?.id === questionAuthorId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAcceptAnswer(answer.id)}
                    className={`p-1 h-8 w-8 ${
                      answer.isAccepted
                        ? "text-green-600 bg-green-50"
                        : "text-gray-400 hover:text-green-600"
                    }`}
                    title={
                      answer.isAccepted ? "Accepted Answer" : "Accept Answer"
                    }
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Answer Content */}
              <div className="flex-1">
                {answer.isAccepted && (
                  <div className="mb-3">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Check className="h-3 w-3 mr-1" />
                      Accepted Answer
                    </Badge>
                  </div>
                )}

                <div
                  className="prose prose-sm max-w-none mb-4"
                  dangerouslySetInnerHTML={{ __html: answer.content }}
                />

                {/* Answer Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Flag className="h-3 w-3 mr-1" />
                      Flag
                    </Button>
                  </div>

                  {/* Author Info */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">
                      answered{" "}
                      {new Date(answer.createdAt).toLocaleDateString("en-GB")}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {answer.author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">
                          {answer.author.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          1,247 reputation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
