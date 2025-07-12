"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/common/Header"
import TitleInput from "@/components/questions/TitleInput"
import RichTextEditor from "@/components/editor/RichTextEditor"
import TagSelector from "@/components/questions/TagSelector"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/authStore"
import { useQuestionStore } from "@/stores/questionStore"
import LoginModal from "@/components/auth/LoginModal"

export default function AskQuestionPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { addQuestion } = useQuestionStore()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
  })

  const [errors, setErrors] = useState({
    title: "",
    content: "",
    tags: "",
  })

  const validateForm = () => {
    const newErrors = {
      title: "",
      content: "",
      tags: "",
    }

    if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters long"
    } else if (formData.title.length > 120) {
      newErrors.title = "Title must be less than 120 characters"
    }

    if (formData.content.length < 20) {
      newErrors.content = "Question body must be at least 20 characters long"
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required"
    } else if (formData.tags.length > 5) {
      newErrors.tags = "Maximum 5 tags allowed"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setShowLoginModal(true)
      return
    }

    if (validateForm()) {
      const newQuestion = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        author: user,
        createdAt: new Date().toISOString(),
        votes: 0,
        answers: [],
        views: 0,
        isAnswered: false,
      }

      addQuestion(newQuestion)
      router.push(`/question/${newQuestion.id}`)
    }
  }

  const isFormValid =
    formData.title.length >= 10 &&
    formData.content.length >= 20 &&
    formData.tags.length > 0 &&
    formData.tags.length <= 5

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
              <p className="text-gray-600 mb-6">You need to be logged in to ask a question.</p>
              <Button onClick={() => setShowLoginModal(true)}>Login to Continue</Button>
            </div>
          </main>
        </div>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ask a Question</h1>
            <p className="text-gray-600">Be specific and imagine you're asking a question to another person</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <TitleInput
              value={formData.title}
              onChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
              error={errors.title}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Body</label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                placeholder="Describe your problem in detail..."
              />
              {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
            </div>

            <TagSelector
              selectedTags={formData.tags}
              onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
              error={errors.tags}
            />

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isFormValid} className="bg-blue-600 hover:bg-blue-700">
                Post Question
              </Button>
            </div>
          </form>
        </div>

        {/* Tips Sidebar */}
        <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Tips for asking a good question</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Make your title specific and descriptive</li>
            <li>• Include relevant code snippets or error messages</li>
            <li>• Explain what you've already tried</li>
            <li>• Use appropriate tags to help others find your question</li>
            <li>• Be respectful and follow community guidelines</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
