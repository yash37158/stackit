"use client"

import { useState } from "react"
import Header from "@/components/common/Header"
import FilterTabs from "@/components/questions/FilterTabs"
import SearchBar from "@/components/common/SearchBar"
import QuestionCard from "@/components/questions/QuestionCard"
import Pagination from "@/components/common/Pagination"
import { useQuestionStore } from "@/stores/questionStore"
import { useAuthStore } from "@/stores/authStore"

export default function HomePage() {
  const { filteredQuestions, currentFilter, setFilter, searchQuery, setSearchQuery } = useQuestionStore()
  const { user } = useAuthStore()
  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 10

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion)
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentFilter === "newest" && "Newest Questions"}
                  {currentFilter === "unanswered" && "Unanswered Questions"}
                  {currentFilter === "popular" && "Popular Questions"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{filteredQuestions.length} questions</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search questions..." />
                <FilterTabs currentFilter={currentFilter} onFilterChange={setFilter} />
              </div>

              <div className="space-y-4">
                {currentQuestions.length > 0 ? (
                  currentQuestions.map((question) => <QuestionCard key={question.id} question={question} />)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No questions found</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {searchQuery ? "Try adjusting your search terms" : "Be the first to ask a question!"}
                    </p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["javascript", "react", "typescript", "node.js", "python", "css", "html", "api"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {user && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mt-4">
                <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions Asked</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Answers Given</span>
                    <span className="font-medium">34</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reputation</span>
                    <span className="font-medium text-green-600">1,247</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
