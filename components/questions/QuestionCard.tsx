"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Eye, ThumbsUp, Clock } from "lucide-react";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const timeAgo = (date: string) => {
    const now = new Date();
    const questionDate = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - questionDate.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return questionDate.toLocaleDateString("en-GB");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Stats - Mobile: Top, Desktop: Left */}
          <div className="flex sm:flex-col gap-4 sm:gap-2 sm:w-20 text-center">
            <div className="flex items-center justify-center gap-1 text-sm">
              <ThumbsUp className="h-4 w-4 text-gray-500" />
              <span
                className={`font-medium ${question.votes > 0 ? "text-green-600" : "text-gray-600"}`}
              >
                {question.votes}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 text-sm">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span
                className={`font-medium ${question.answers.length > 0 ? "text-blue-600" : "text-gray-600"}`}
              >
                {question.answers.length}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 text-sm">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{question.views}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <Link
                href={`/question/${question.id}`}
                className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors line-clamp-2"
              >
                {question.title}
              </Link>
            </div>

            <div className="text-gray-600 text-sm mb-4 line-clamp-2">
              {question.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Author and Time */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">
                    {question.author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span>
                  asked by{" "}
                  <span className="font-medium text-gray-700">
                    {question.author.name}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{timeAgo(question.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
