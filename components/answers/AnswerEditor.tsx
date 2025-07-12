"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import RichTextEditor from "@/components/editor/RichTextEditor"

interface AnswerEditorProps {
  onSubmit: (content: string) => void
}

export default function AnswerEditor({ onSubmit }: AnswerEditorProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (content.trim().length < 20) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(content)
      setContent("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = content.trim().length >= 20

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="Write your answer here... Be thorough and explain your reasoning."
      />

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {content.length < 20 && <span className="text-red-600">Answer must be at least 20 characters long</span>}
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setContent("")} disabled={!content || isSubmitting}>
            Clear
          </Button>
          <Button type="submit" disabled={!isValid || isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Posting..." : "Post Answer"}
          </Button>
        </div>
      </div>
    </form>
  )
}
