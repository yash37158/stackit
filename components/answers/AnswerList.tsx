"use client";

import { useState } from "react"
import VoteButton from "@/components/common/VoteButton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Share2 } from "lucide-react"
import type { Answer } from "@/types"
import { useAuthStore } from "@/stores/authStore"
import { useQuestionStore } from "@/stores/questionStore"
import LoginModal from "@/components/auth/LoginModal"
import { renderMarkdown } from "@/lib/utils"


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
    voteOnAnswer(questionId, answerId, type === "up" ? "upvote" : "downvote")
  }


  const handleAcceptAnswer = (answerId: string) => {
    if (!user || user.id !== questionAuthorId) return;
    acceptAnswer(questionId, answerId);
  };

  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1
    if (!a.isAccepted && b.isAccepted) return 1
    const aVotes = (a.votes || []).reduce((sum, vote) => sum + (vote.type === "upvote" ? 1 : -1), 0)
    const bVotes = (b.votes || []).reduce((sum, vote) => sum + (vote.type === "upvote" ? 1 : -1), 0)
    return bVotes - aVotes
  })

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
                  votes={(answer.votes || []).reduce((sum, vote) => sum + (vote.type === "upvote" ? 1 : -1), 0)}
                  onVote={(type) => handleVote(answer.id, type)}
                  orientation="vertical"
                  userVote={answer.votes?.find(vote => vote.user.id === user?.id)?.type === "upvote" ? "up" : 
                           answer.votes?.find(vote => vote.user.id === user?.id)?.type === "downvote" ? "down" : null}
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

                <div className="prose prose-sm max-w-none mb-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(answer.content) }} />

                {/* Answer Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
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
                          {answer.author?.username?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{answer.author?.username || 'Unknown User'}</div>
                        

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
