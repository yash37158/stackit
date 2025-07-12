"use client"

import { Badge } from "@/components/ui/badge"
import type { Question } from "@/types"

interface QuestionBodyProps {
  question: Question
}

export default function QuestionBody({ question }: QuestionBodyProps) {
  return (
    <div className="space-y-4">
      {/* Question Content */}
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: question.content }} />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        {question.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Author Info */}
      <div className="flex justify-end pt-4">
        <div className="bg-blue-50 rounded-lg p-4 max-w-xs">
          <div className="text-xs text-gray-600 mb-2">asked {new Date(question.createdAt).toLocaleDateString()}</div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">{question.author.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div className="font-medium text-sm text-gray-900">{question.author.name}</div>
              <div className="text-xs text-gray-600">1,247 reputation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
